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

module "controlLambda" {
    source = "./budgetController"

    private_subnet = module.vpc.private_subnet
    lambda_sg = module.vpc.lambda_sg
    ecr_uri = module.ecrRepo.ecr_uri
}
