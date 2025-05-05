#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment process...${NC}"

# Check if kubectl is configured
if ! kubectl cluster-info >/dev/null 2>&1; then
    echo -e "${RED}kubectl is not properly configured. Please set up your kubeconfig.${NC}"
    exit 1
fi

# Apply PostgreSQL configurations
echo -e "${YELLOW}Deploying PostgreSQL...${NC}"
kubectl apply -f k8s/postgresql-statefulset.yaml
kubectl apply -f k8s/secrets.yaml

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=postgresql --timeout=300s

# Apply application configurations
echo -e "${YELLOW}Deploying Product Service...${NC}"
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Wait for deployment
echo -e "${YELLOW}Waiting for deployment to be ready...${NC}"
kubectl wait --for=condition=available deployment/product-service --timeout=300s

# Get service information
echo -e "${GREEN}Deployment completed!${NC}"
echo -e "${YELLOW}Service information:${NC}"
kubectl get svc product-service

# Check if ArgoCD is available
if kubectl get crd applications.argoproj.io >/dev/null 2>&1; then
    echo -e "${YELLOW}Applying ArgoCD application...${NC}"
    kubectl apply -f k8s/argocd-application.yaml
    echo -e "${GREEN}ArgoCD application created successfully!${NC}"
else
    echo -e "${YELLOW}ArgoCD not detected in the cluster.${NC}"
fi

echo -e "${GREEN}All deployments completed successfully!${NC}"