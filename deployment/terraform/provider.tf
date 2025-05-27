provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
    encrypt = true
  }
  required_providers {
    
  }
  required_version = ">= 1.3.0"
}