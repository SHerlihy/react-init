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

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_internet_gateway" "gateway" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "pub_to_net" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gateway.id
  }
}

resource "aws_subnet" "public" {
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "eu-west-2a"
  map_public_ip_on_launch = true
  depends_on = [aws_internet_gateway.gateway]
}

resource "aws_route_table_association" "pub_to_net" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.pub_to_net.id
}

resource "aws_eip" "public" {
  vpc = true
  depends_on                = [aws_internet_gateway.gateway]
}

resource "aws_nat_gateway" "to_pub" {
  allocation_id = aws_eip.public.id
  subnet_id                          = aws_subnet.public.id
}

resource "aws_route_table" "pvt_to_pub" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.to_pub.id
  }
}

resource "aws_subnet" "private" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "eu-west-2a"
}

resource "aws_route_table_association" "pvt_to_pub" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.pvt_to_pub.id
}

resource "aws_default_security_group" "sg_for_lambda" {
  vpc_id = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol  = -1
    self      = true
    from_port = 0
    to_port   = 0
  }
}

# EFS file system
resource "aws_efs_file_system" "efs_for_lambda" {}

# Mount target connects the file system to the subnet
resource "aws_efs_mount_target" "alpha" {
  file_system_id  = aws_efs_file_system.efs_for_lambda.id
  subnet_id       = aws_subnet.private.id
  security_groups = [aws_default_security_group.sg_for_lambda.id]
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
  image_uri = "086900566647.dkr.ecr.eu-west-2.amazonaws.com/lambda-create-lambda:latest"
  function_name = "handle"

  role = aws_iam_role.lambda_exec.arn

  memory_size = 1024
  timeout = 300

  file_system_config {
    arn = aws_efs_access_point.access_point_for_lambda.arn
    local_mount_path = "/mnt/efs"
  }

  vpc_config {
    subnet_ids         = [aws_subnet.private.id]
    security_group_ids = [aws_default_security_group.sg_for_lambda.id]
  }

  depends_on = [aws_efs_mount_target.alpha]
}

resource "aws_lambda_function" "test" {
  filename = "handle.zip"
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
    subnet_ids         = [aws_subnet.private.id]
    security_group_ids = [aws_default_security_group.sg_for_lambda.id]
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
