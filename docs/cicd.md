# CI/CD Pipeline Documentation

This document provides an overview of the CI/CD pipeline for the Doctor Booking System.

## Overview

The Doctor Booking System uses GitHub Actions for continuous integration and continuous deployment to AWS EKS. The pipeline automates testing, building, and deploying the application to staging and production environments.

## Pipeline Architecture

```
┌─────────────┐     ┌───────────────┐     ┌────────────────┐
│    Test     │────▶│ Build & Push  │────▶│ Deploy to EKS  │
└─────────────┘     └───────────────┘     └────────────────┘
```

## Workflow Stages

### 1. Test

- Runs unit tests for both backend (Go) and frontend (React)
- Validates code quality and functionality
- Must pass before proceeding to build and deployment stages

### 2. Build & Push to ECR

- Builds Docker images for backend and frontend
- Authenticates with AWS ECR using IAM roles
- Pushes images to Amazon ECR with appropriate tags
- Tags images with commit SHA and 'latest'

### 3. Deploy to EKS

- Authenticates with AWS EKS cluster
- Updates Kubernetes manifests with new image references using Kustomize
- Applies the updated manifests to the appropriate namespace
- Verifies successful deployment

## Environments

The pipeline supports two environments:

1. **Staging**
   - Deployed when changes are pushed to the `staging` branch
   - Used for testing and validation before production
   - Namespace: `doctor-booking-staging`

2. **Production**
   - Deployed when changes are pushed to the `main` branch
   - The live environment used by end users
   - Namespace: `doctor-booking-production`

## Triggering the Pipeline

The pipeline can be triggered in two ways:

1. **Automatically**:
   - Push to `staging` branch → Deploy to staging
   - Push to `main` branch → Deploy to production
   - Pull requests to either branch → Run tests only

2. **Manually**:
   - Go to GitHub Actions tab
   - Select "CI/CD Pipeline for EKS"
   - Click "Run workflow"
   - Select the desired environment

## Required Secrets

The following secrets must be configured in your GitHub repository:

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key ID with permissions to push to ECR and deploy to EKS |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key corresponding to the access key ID |
| `AWS_REGION` | AWS region where resources are deployed (defaults to us-east-1) |
| `EKS_CLUSTER_NAME` | Name of the EKS cluster (defaults to doctor-booking-eks) |

## Monitoring Deployments

After deployment, you can monitor the status:

1. In the GitHub Actions UI under the "Deploy to EKS" job
2. Using kubectl commands:
   ```bash
   # For staging
   kubectl get all -n doctor-booking-staging
   
   # For production
   kubectl get all -n doctor-booking-production
   ```

## Rollback Procedure

To rollback to a previous version:

1. Find the previous successful workflow run in GitHub Actions
2. Note the commit SHA
3. Manually trigger the workflow with the appropriate environment
4. Or use kubectl to rollback:
   ```bash
   kubectl rollout undo deployment/doctor-booking-api -n doctor-booking-production
   kubectl rollout undo deployment/doctor-booking-frontend -n doctor-booking-production
   ```

## Local Development with Kubernetes

Use the Makefile commands for local development:

```bash
# Apply Kubernetes manifests to staging
make k8s-apply ENV=staging

# Check status of resources
make k8s-status ENV=staging

# View logs
make k8s-logs POD=<pod-name> ENV=staging
```

## Troubleshooting

Common issues and solutions:

1. **Failed Tests**: Check test logs for errors and fix failing tests
2. **Image Build Failures**: Verify Dockerfile configurations and dependencies
3. **Deployment Failures**: Check EKS permissions and Kubernetes manifest validity
4. **Access Issues**: Ensure IAM roles have appropriate permissions

For more detailed information, refer to the [AWS EKS documentation](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) and [GitHub Actions documentation](https://docs.github.com/en/actions).
