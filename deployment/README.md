# Doctor Booking System - Deployment

This directory contains the infrastructure as code (IaC) and Kubernetes configurations for deploying the Doctor Booking System to AWS EKS using EKS Auto Mode.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Deployment Steps](#deployment-steps)
- [Configuration](#configuration)
- [Accessing the Cluster](#accessing-the-cluster)
- [Monitoring and Logging](#monitoring-and-logging)
- [Clean Up](#clean-up)

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform 1.3.0 or later
- kubectl
- AWS IAM permissions to create EKS clusters and related resources

## Architecture

The deployment consists of the following components:

- **AWS EKS Cluster** with EKS Auto Mode
- **VPC** with public and private subnets across multiple AZs
- **IAM Roles** for EKS control plane and worker nodes
- **Kubernetes Manifests** for application deployment

## Directory Structure

```
deployment/
├── terraform/              # Terraform configuration for AWS infrastructure
│   ├── back_end/           # Environment-specific configurations
│   ├── iam.tf              # IAM roles and policies
│   ├── main.tf             # Main EKS cluster configuration
│   ├── outputs.tf          # Output variables
│   ├── provider.tf         # Provider configuration
│   ├── variables.tf        # Variable definitions
│   └── vpc.tf              # VPC and networking
└── k8s/                    # Kubernetes manifests
    └── base/               # Base Kubernetes resources
        ├── deployment.yaml  # Application deployments
        ├── service.yaml    # Kubernetes services
        ├── ingress.yaml    # Ingress configuration
        ├── hpa.yaml        # Horizontal Pod Autoscaler
        ├── secret.yaml     # Kubernetes secrets
        └── namespace.yaml  # Namespace configuration
```

## Deployment Steps

### 1. Initialize Terraform

```bash
cd deployment/terraform
terraform init
```

### 2. Review the Execution Plan

```bash
terraform plan
```

### 3. Apply the Configuration

```bash
terraform apply
```

### 4. Configure kubectl

```bash
aws eks --region $(terraform output -raw aws_region) update-kubeconfig --name $(terraform output -raw cluster_name)
```

### 5. Deploy Kubernetes Resources

```bash
kubectl apply -k ../k8s/base
```

## Configuration

### Terraform Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `aws_region` | AWS region | `us-east-1` |
| `cluster_name` | EKS cluster name | `staging-eks` |
| `cluster_version` | Kubernetes version | `1.32` |
| `vpc_cidr` | VPC CIDR block | `10.20.0.0/19` |
| `azs` | Availability zones | `["us-east-1a", "us-east-1b", "us-east-1c"]` |

### Kubernetes Configuration

- **Namespaces**: `doctor-booking`
- **Services**:
  - `api`: Backend API service
  - `frontend`: Frontend web service

## Accessing the Cluster

### API Server Endpoint

```bash
kubectl cluster-info
```

### Application Access

Get the application URL:

```bash
kubectl get ingress -n doctor-booking
```

## Monitoring and Logging

### CloudWatch Container Insights

Container Insights is enabled by default for monitoring the EKS cluster.

### Kubernetes Dashboard

Deploy the Kubernetes Dashboard:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

## Clean Up

To destroy all resources:

```bash
cd deployment/terraform
terraform destroy
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify AWS credentials are configured correctly
   - Check IAM permissions for EKS

2. **Node Group Failures**
   - Check CloudWatch logs for EKS
   - Verify subnet configurations

3. **Networking Issues**
   - Check VPC flow logs
   - Verify security group rules

For additional support, please refer to the [AWS EKS documentation](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html).