# Doctor Booking – Infra and Production Deployment Guide

This document focuses on end-to-end infrastructure provisioning with Terraform and deploying the production workload on Kubernetes using Kustomize.

For a full, narrative walkthrough of the project architecture and application details, see the original article: https://www.learnxops.com/project-scalable-doctor-consultation-booking-system-using-golang-react-docker-compose-terraform-eks/

## Prerequisites
- AWS account with permissions for ECR, EKS, VPC, IAM, ACM, ALB
- Tools installed locally:
  - awscli
  - terraform (>= 1.3 recommended)
  - kubectl
  - kustomize (kubectl 1.14+ includes `kubectl kustomize`)
  - docker

## Repository Structure (relevant to deployment)
- `deployment/terraform/` – Terraform code to provision VPC, EKS and related IAM
- `deployment/k8s/base/` – Base manifests for namespace, secrets, config, PostgreSQL, backend, frontend
- `deployment/k8s/overlays/production/` – Production-specific patches and Ingress

## 1) Provision Cloud Infrastructure with Terraform

Working directory: `deployment/terraform/`

1. Initialize the Terraform project (uses the remote backend config):

   ```bash
   terraform init -backend-config=./back_end/production.tf
   ```

2. Review the execution plan:

   ```bash
   terraform plan
   ```

3. Apply changes to create/update infrastructure:

   ```bash
   terraform apply
   ```

4. Update your local kubeconfig to connect to the created EKS cluster (replace values as needed):

   ```bash
   aws eks update-kubeconfig --name "demo-eks" --region "us-east-1"
   ```

## 2) Build and Push Application Images to ECR

Create two ECR repositories (if Terraform didn’t already create them) or ensure they exist:
- `doctor-booking-api`
- `doctor-booking-frontend`

Authenticate Docker to ECR and build/push images. Replace placeholders accordingly.

```bash
ACCOUNT_ID=<your_aws_account_id>
REGION=us-east-1
API_REPO=${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/doctor-booking-api
FE_REPO=${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/doctor-booking-frontend
TAG=production

aws ecr get-login-password --region ${REGION} \
  | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

# Backend
docker build -t ${API_REPO}:${TAG} -f ./backend/Dockerfile ./backend
docker push ${API_REPO}:${TAG}

# Frontend
docker build -t ${FE_REPO}:${TAG} -f ./frontend/Dockerfile ./frontend
docker push ${FE_REPO}:${TAG}
```

Make sure the image references in `deployment/k8s/overlays/production/kustomization.yaml` match the ECR paths and tags you pushed.

## 3) Configure Production Kustomize Overlay

Files to review and update:
- `deployment/k8s/overlays/production/kustomization.yaml`
  - Patches set replicas, resource requests/limits, image names, and secrets.
- `deployment/k8s/overlays/production/ingress.yaml`
  - Ensure the following are correct for your environment:
    - `alb.ingress.kubernetes.io/certificate-arn`
    - `rules[].host` (your domain)

Notes:
- The overlay sets `namespace: doctor-booking-production`. Kustomize will apply this namespace to namespaced resources unless they hardcode metadata.namespace. If you change the namespace, keep it consistent across resources.
- The base secret at `deployment/k8s/base/secret.yaml` contains default values. The production overlay overrides secrets using `stringData`. Update the values before deploying.

## 4) Deploy to Production

Apply the production overlay from the repository root:

```bash
kubectl apply -k deployment/k8s/overlays/production
```

Check resources and rollout status:

```bash
kubectl get ns
kubectl -n doctor-booking-production get all,ingress
kubectl -n doctor-booking-production rollout status deploy/doctor-booking-api
kubectl -n doctor-booking-production rollout status deploy/doctor-booking-frontend
```

## 5) Post-Deployment
- Verify the ALB Ingress is provisioned and has an address.
- Confirm DNS points your domain (e.g., `doctor-booking.example.com`) to the ALB.
- Test API at `/api/v1` and UI at the root path.

## Configuration Checklist
- AWS account ID and region updated in image URIs
- ECR repositories exist and images pushed with the correct tag
- EKS kubeconfig updated for the right cluster/region
- Ingress certificate ARN and host updated
- Production secrets set with strong values (DB password, JWT secret, etc.)

## Useful Paths
- Terraform: `deployment/terraform/`
- Kustomize base: `deployment/k8s/base/`
- Kustomize production overlay: `deployment/k8s/overlays/production/`

If you run into issues or want to extend the infra, open an issue or update the respective Terraform/Kubernetes manifests.
