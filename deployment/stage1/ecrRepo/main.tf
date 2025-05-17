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

resource "aws_ecr_repository" "lambda-create-lambda" {
  name                 = "lambda-create-lambda"
  image_tag_mutability = "MUTABLE"
}

output "ecr_uri" {
value = resource.aws_ecr_repository.lambda-create-lambda.repository_url
}
