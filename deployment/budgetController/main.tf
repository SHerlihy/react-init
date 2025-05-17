terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "eu-west-2"
  profile = "react_showcase_admin"
  assume_role {
    role_arn = "arn:aws:iam::086900566647:role/admin_role"
  }
}

variable "private_subnet"{
  type = string
}

variable "lambda_sg"{
  type = string
}

variable "ecr_uri"{
  type = string
}

resource "aws_efs_file_system" "efs_for_lambda" {}

# Mount target connects the file system to the subnet
resource "aws_efs_mount_target" "alpha" {
  file_system_id  = aws_efs_file_system.efs_for_lambda.id
  subnet_id       = var.private_subnet
  security_groups = [var.lambda_sg]
}

# EFS access point used by lambda file system
resource "aws_efs_access_point" "access_point_for_lambda" {
  file_system_id = aws_efs_file_system.efs_for_lambda.id

  
  root_directory {
    path = "/lambda"
    creation_info {
      owner_gid   = 1000
      owner_uid   = 1000
      permissions = "777"
    }
  }

  posix_user {
    gid = 1000
    uid = 1000
  }
}

resource "aws_lambda_function" "provision" {
  package_type = "Image"
  image_uri = "${var.ecr_uri}:latest"
  function_name = "handle"

  role = aws_iam_role.lambda_exec.arn

  memory_size = 1024
  timeout = 300

  file_system_config {
    arn = aws_efs_access_point.access_point_for_lambda.arn
    local_mount_path = "/mnt/efs"
  }

  vpc_config {
    subnet_ids         = [var.private_subnet]
    security_group_ids = [var.lambda_sg]
  }

  depends_on = [aws_efs_mount_target.alpha]
}

resource "aws_lambda_function" "test" {
  filename = "${path.module}/handle.zip"
  handler = "handle.handler"
  function_name = "test"
  runtime = "nodejs18.x"

  role = aws_iam_role.lambda_exec.arn

  timeout = 300

  file_system_config {
    arn = aws_efs_access_point.access_point_for_lambda.arn
    local_mount_path = "/mnt/efs"
  }

  vpc_config {
    subnet_ids         = [var.private_subnet]
    security_group_ids = [var.lambda_sg]
  }

  depends_on = [aws_efs_mount_target.alpha]
}

resource "aws_cloudwatch_log_group" "provision" {
  name = "/aws/lambda/${aws_lambda_function.provision.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_exec" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_vpc" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
