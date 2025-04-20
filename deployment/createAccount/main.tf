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

resource "aws_sns_topic" "overspend" {
  name = "overspend"
}

resource "aws_sns_topic_subscription" "overspend_email" {
  protocol  = "email"
  endpoint  = "steven0herlihy+react_showcase@gmail.com"
  topic_arn = aws_sns_topic.overspend.arn
}

resource "aws_cloudwatch_metric_alarm" "overspend" {
  alarm_name  = "overspend"
  namespace   = "AWS/Billing"
  metric_name = "EstimatedCharges"

  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = 1

  evaluation_periods = 1
  period             = 120
  statistic          = "Maximum"

  insufficient_data_actions = [aws_sns_topic.overspend.arn]

  alarm_actions = [aws_sns_topic.overspend.arn]
}
