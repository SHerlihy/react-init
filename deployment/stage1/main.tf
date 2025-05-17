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

module "vpc" {
    source = "./vpc"
}

module "ecrRepo" {
    source = "./ecrRepo"
}

output "private_subnet" {
    value = module.vpc.private_subnet
}

output "lambda_sg" {
    value = module.vpc.lambda_sg
}

output "ecr_uri" {
    value = module.ecrRepo.ecr_uri
}
