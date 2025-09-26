
Initialize the terraform project:

terraform init -backend-config=./back_end/production.tf

Check expetected changes in cloud infra:
terraform plan  

Apply all the changes:

terraform apply


aws eks update-kubeconfig --name "demo-eks" --region "us-east-1"


------


build and push api container
ACCOUNT_ID=your_account_here
REGION=us-east-1
API_REPO=${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/doctor-booking-api
FE_REPO=${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/doctor-booking-frontend
TAG=production

build and push images

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com


docker build -t ${API_REPO}:${TAG} -f ./backend/Dockerfile ./backend
docker build -t ${API_REPO}:${TAG} -f ./backend/Dockerfile ./backend
docker push ${API_REPO}:${TAG}

docker build -t ${FE_REPO}:${TAG} -f ./frontend/Dockerfile ./frontend
docker build -t ${FE_REPO}:${TAG} -f ./frontend/Dockerfile ./frontend
docker push ${FE_REPO}:${TAG}





kubectl apply -k deployment/k8s/overlays/production



