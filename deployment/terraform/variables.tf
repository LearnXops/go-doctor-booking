variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "doctor-booking"
}

variable "environment" {
  description = "Environment (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "us-west-2"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# EKS Variables
variable "kubernetes_version" {
  description = "Kubernetes version to use for the EKS cluster"
  type        = string
  default     = "1.28"
}

variable "node_instance_types" {
  description = "List of instance types for the EKS node group"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_desired_size" {
  description = "Desired number of nodes in the EKS node group"
  type        = number
  default     = 2
}

variable "node_min_size" {
  description = "Minimum number of nodes in the EKS node group"
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum number of nodes in the EKS node group"
  type        = number
  default     = 3
}

# RDS Variables
variable "create_rds" {
  description = "Whether to create RDS instance"
  type        = bool
  default     = true
}

variable "db_instance_class" {
  description = "The instance type of the RDS instance"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "The allocated storage in gigabytes"
  type        = number
  default     = 20
}

variable "db_username" {
  description = "Username for the master DB user"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Password for the master DB user"
  type        = string
  sensitive   = true
  default     = "changeme123" # In production, use a secure password from a secret manager
}

variable "db_name" {
  description = "The name of the database to create when the DB instance is created"
  type        = string
  default     = "doctor_booking"
}

variable "db_multi_az" {
  description = "Specifies if the RDS instance is multi-AZ"
  type        = bool
  default     = false
}

variable "db_skip_final_snapshot" {
  description = "Determines whether a final DB snapshot is created before the DB instance is deleted"
  type        = bool
  default     = true # Set to false in production
}

variable "db_deletion_protection" {
  description = "The database can't be deleted when this value is set to true"
  type        = bool
  default     = false # Set to true in production
}

variable "kms_key_arn" {
  description = "The ARN of the KMS key to use for encryption"
  type        = string
  default     = null
}

# Kubernetes Variables
variable "kubernetes_namespace" {
  description = "Kubernetes namespace to deploy the application"
  type        = string
  default     = "doctor-booking"
}

variable "jwt_secret" {
  description = "Secret key for JWT token generation"
  type        = string
  sensitive   = true
  default     = "change-this-to-a-secure-random-string"
}

# Tags
variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}
