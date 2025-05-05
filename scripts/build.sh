#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting build process...${NC}"

# Configuration
DOCKER_USERNAME="jpaezr"
IMAGE_NAME="product-service-v1"
TAG="latest"

# Build Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Docker image built successfully!${NC}"
else
    echo -e "${RED}Docker build failed!${NC}"
    exit 1
fi

# Tag image
echo -e "${YELLOW}Tagging image...${NC}"
docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}

# Push to Docker Hub
echo -e "${YELLOW}Pushing to Docker Hub...${NC}"
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Image pushed successfully to Docker Hub!${NC}"
else
    echo -e "${RED}Failed to push image to Docker Hub!${NC}"
    exit 1
fi

echo -e "${GREEN}Build process completed successfully!${NC}"