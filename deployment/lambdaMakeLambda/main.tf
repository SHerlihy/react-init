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

resource "aws_lambda_function" "provision" {
  package_type = "Image"
  image_uri = "086900566647.dkr.ecr.eu-west-2.amazonaws.com/lambda-create-lambda:latest"
  function_name = "handle"

  runtime = "nodejs18.x"

  role = aws_iam_role.lambda_exec.arn

  timeout = 30
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
