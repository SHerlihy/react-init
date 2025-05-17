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

output "private_subnet" {
    value = aws_subnet.private.id
}

output "lambda_sg" {
    value = aws_default_security_group.sg_for_lambda.id
}
