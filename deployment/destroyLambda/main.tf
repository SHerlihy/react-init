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

data "archive_file" "destroy" {
  type = "zip"

  source_dir  = "${path.module}/runtime"
  output_path = "${path.module}/runtime.zip"
}

data "archive_file" "tf" {
  type = "zip"

  source_dir = "/usr/local/bin/terraform"
  output_path = "${path.module}/tf.zip"
}

resource "aws_lambda_function" "destroy" {
  filename = "runtime.zip"
  function_name = "Destroy"

  runtime = "nodejs18.x"
  handler = "function.handler"

  source_code_hash = data.archive_file.destroy.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_layer_version" "tf" {
  filename   = "tf.zip"
  layer_name = "tf"

  compatible_runtimes = ["nodejs20.x"]
}

resource "aws_cloudwatch_log_group" "destroy" {
  name = "/aws/lambda/${aws_lambda_function.destroy.function_name}"

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

output "function_name" {
  description = "Name of the Lambda function."

  value = aws_lambda_function.destroy.function_name
}

resource "aws_lambda_permission" "with_sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.destroy.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.overspend_topic
}

resource "aws_sns_topic_subscription" "destroy" {
  topic_arn = var.overspend_topic
  protocol  = "lambda"
  endpoint  = aws_lambda_function.destroy.arn
}
