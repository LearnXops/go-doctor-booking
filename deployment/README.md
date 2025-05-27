# Doctor Booking System - Deployment Guide

This directory contains the infrastructure as code (IaC) and Kubernetes manifests for deploying the Doctor Booking System to AWS EKS.

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. kubectl
3. Terraform (>= 1.0.0)
4. Docker
5. AWS IAM Authenticator

## Directory Structure

```
deployment/
├── terraform/              # Terraform configuration for AWS infrastructure
│   ├── modules/            # Reusable Terraform modules
│   │   ├── eks/            # EKS cluster configuration
│   │   ├── rds/            # RDS PostgreSQL configuration
│   │   └── vpc/            # VPC and networking
│   ├── main.tf             # Main Terraform configuration
│   ├── variables.tf        # Variable definitions
│   └── outputs.tf          # Output values
└── k8s/                    # Kubernetes manifests
    ├── base/               # Base configuration
    │   ├── deployment.yaml
    │   ├── service.yaml
    │   ├── ingress.yaml
    │   ├── hpa.yaml
    │   ├── configmap.yaml
    │   └── secret.yaml
    └── overlays/
        ├── staging/        # Staging environment overrides
        │   └── kustomization.yaml
        └── production/     # Production environment overrides
            └── kustomization.yaml
```

## Deployment Steps

### 1. Set up AWS Infrastructure with Terraform

1. Navigate to the Terraform directory:
   ```bash
   cd deployment/terraform
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Review the execution plan:
   ```bash
   terraform plan -var="db_password=your_secure_password"
   ```

4. Apply the changes (this will create all AWS resources):
   ```bash
   terraform apply -var="db_password=your_secure_password"
   ```

5. After successful deployment, configure kubectl:
   ```bash
   aws eks --region $(terraform output -raw aws_region) update-kubeconfig --name $(terraform output -raw cluster_name)
   ```

### 2. Deploy the Application to Kubernetes

1. Build and push your Docker images to ECR:
   ```bash
   # Build and tag the images
   docker build -t your-ecr-repo/doctor-booking-api:latest -f backend/Dockerfile .
   docker build -t your-ecr-repo/doctor-booking-frontend:latest -f frontend/Dockerfile .
   
   # Push to ECR
   aws ecr get-login-password --region region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.region.amazonaws.com
   docker push your-ecr-repo/doctor-booking-api:latest
   docker push your-ecr-repo/doctor-booking-frontend:latest
   ```

2. Deploy to staging:
   ```bash
   kubectl apply -k k8s/overlays/staging
   ```

3. Deploy to production (after testing in staging):
   ```bash
   kubectl apply -k k8s/overlays/production
   ```

### 3. Access the Application

1. Get the ALB hostname:
   ```bash
   kubectl get ingress -n doctor-booking-staging
   kubectl get ingress -n doctor-booking-production
   ```

2. Access the application using the ALB hostname in your browser.

## Environment Variables

### Required for Terraform
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_DEFAULT_REGION`: AWS region (default: us-west-2)

### Required for Application
These will be set in Kubernetes secrets:
- `DB_HOST`: RDS endpoint
- `DB_PORT`: RDS port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens

## Clean Up

To destroy all resources created by Terraform:

```bash
cd deployment/terraform
terraform destroy -var="db_password=your_secure_password"
```

## Monitoring and Logging

- **Kubernetes Dashboard**: Deploy using `kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml`
- **Metrics Server**: `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`
- **AWS CloudWatch**: Configure Fluent Bit for container logs

## Troubleshooting

1. **Kubernetes connection issues**:
   - Verify `kubectl` is configured with the correct context
   - Check AWS IAM permissions for the EKS cluster

2. **Pod failures**:
   - Check pod logs: `kubectl logs <pod-name> -n <namespace>`
   - Describe pod: `kubectl describe pod <pod-name> -n <namespace>`

3. **Ingress issues**:
   - Verify the ALB was created and has the correct security group rules
   - Check the ALB target group health checks

For more information, refer to the [AWS EKS documentation](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html).
