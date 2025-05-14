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
  shared_credentials_files = ["${path.module}/.aws/credentials"]
  profile = "react_showcase_admin"
  region  = "eu-west-2"
  assume_role {
    role_arn = "arn:aws:iam::086900566647:role/admin_role"
  }
}

resource "aws_instance" "app_server" {
  ami           = "ami-0fc32db49bc3bfbb1"
  instance_type = "t2.micro"

  tags = {
    Name = "ExampleAppServerInstance"
  }
}
