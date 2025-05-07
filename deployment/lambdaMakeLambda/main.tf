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

data "archive_file" "provision" {
  type = "zip"

  source_file = "${path.module}/provision/function.js"
  output_path = "${path.module}/provision.zip"
}

data "archive_file" "layer" {
  type = "zip"

  source_dir = "${path.module}/tfLayer"
  output_path = "${path.module}/terraform.zip"
}

resource "aws_lambda_function" "provision" {
  filename = "provision.zip"
  function_name = "provision"

  runtime = "nodejs18.x"
  handler = "function.handler"

  source_code_hash = data.archive_file.provision.output_base64sha256

  role = aws_iam_role.lambda_exec.arn

  layers = [aws_lambda_layer_version.lambda_layer.arn]

  timeout = 30
}

resource "aws_lambda_layer_version" "lambda_layer" {
  filename   = "terraform.zip"
  layer_name = "lambda_layer_name"

  compatible_runtimes = ["nodejs18.x"]

  source_code_hash = data.archive_file.layer.output_base64sha256
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

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
