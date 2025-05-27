output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

output "node_security_group_id" {
  description = "Security group ID attached to the EKS nodes"
  value       = module.vpc.node_security_group_id
}

output "cluster_name" {
  description = "Kubernetes Cluster Name"
  value       = module.eks.cluster_name
}

output "db_instance_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = var.create_rds ? module.rds[0].db_instance_endpoint : ""
}

output "db_instance_port" {
  description = "The port the database is listening on"
  value       = var.create_rds ? module.rds[0].db_instance_port : ""
}

output "db_instance_name" {
  description = "The name of the database"
  value       = var.create_rds ? module.rds[0].db_instance_name : ""
}

output "kubernetes_namespace" {
  description = "Kubernetes namespace where the application is deployed"
  value       = kubernetes_namespace.main.metadata[0].name
}

# Instructions for configuring kubectl
output "configure_kubectl" {
  description = "Configure kubectl: make sure you're logged in to the correct AWS account and region, then run these commands to update your kubeconfig"
  value = <<EOT
    aws eks --region ${var.aws_region} update-kubeconfig --name ${module.eks.cluster_name}
    # Test your configuration:
    kubectl get nodes -A
  EOT
}

# Instructions for accessing the application
output "application_access" {
  description = "Instructions for accessing the application"
  value = <<EOT
    # Get the LoadBalancer URL for the application:
    kubectl get svc -n ${var.kubernetes_namespace} -o wide
    
    # Access the application through the LoadBalancer URL
  EOT
}
