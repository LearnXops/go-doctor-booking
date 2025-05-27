terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  #backend "s3" {
    # This will be configured when setting up the backend
    # bucket = "your-terraform-state-bucket"
    # key    = "doctor-booking/terraform.tfstate"
    # region = "us-west-2"
  #}
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      Terraform   = "true"
    }
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority)
  token                  = data.aws_eks_cluster_auth.main.token
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority)
    token                  = data.aws_eks_cluster_auth.main.token
  }
}

data "aws_eks_cluster_auth" "main" {
  name = module.eks.cluster_id
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
  tags         = local.tags
}

# EKS Module
module "eks" {
  source = "./modules/eks"

  project_name            = var.project_name
  kubernetes_version      = var.kubernetes_version
  subnet_ids              = concat(module.vpc.public_subnet_ids, module.vpc.private_subnet_ids)
  node_subnet_ids        = module.vpc.private_subnet_ids
  cluster_security_group_id = module.vpc.cluster_security_group_id
  node_security_group_id  = module.vpc.node_security_group_id
  node_instance_types     = var.node_instance_types
  node_desired_size      = var.node_desired_size
  node_min_size          = var.node_min_size
  node_max_size          = var.node_max_size
  tags                   = local.tags
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  count = var.create_rds ? 1 : 0

  project_name               = var.project_name
  private_subnet_ids        = module.vpc.private_subnet_ids
  vpc_id                    = module.vpc.vpc_id
  eks_node_security_group_id = module.vpc.node_security_group_id
  db_instance_class         = var.db_instance_class
  allocated_storage         = var.db_allocated_storage
  db_username               = var.db_username
  db_password               = var.db_password
  db_name                   = var.db_name
  kms_key_arn              = var.kms_key_arn
  multi_az                 = var.db_multi_az
  skip_final_snapshot      = var.db_skip_final_snapshot
  deletion_protection      = var.db_deletion_protection
  tags                     = local.tags
}

# Kubernetes Namespace
resource "kubernetes_namespace" "main" {
  metadata {
    name = var.kubernetes_namespace
  }
}

# Kubernetes Secret for Database
resource "kubernetes_secret" "database" {
  count = var.create_rds ? 1 : 0

  metadata {
    name      = "database-credentials"
    namespace = kubernetes_namespace.main.metadata[0].name
  }


  data = {
    DB_HOST     = module.rds[0].db_instance_endpoint
    DB_PORT     = module.rds[0].db_instance_port
    DB_NAME     = module.rds[0].db_instance_name
    DB_USER     = module.rds[0].db_instance_username
    DB_PASSWORD = var.db_password
  }

  type = "Opaque"
}

# Kubernetes Secret for JWT
resource "kubernetes_secret" "jwt" {
  metadata {
    name      = "jwt-secret"
    namespace = kubernetes_namespace.main.metadata[0].name
  }

  data = {
    JWT_SECRET = var.jwt_secret
  }

  type = "Opaque"
}

# Kubernetes Secret for Application Environment
resource "kubernetes_secret" "app_env" {
  metadata {
    name      = "app-env"
    namespace = kubernetes_namespace.main.metadata[0].name
  }

  data = {
    NODE_ENV = var.environment
  }

  type = "Opaque"
}
