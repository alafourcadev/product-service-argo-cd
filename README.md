# Product Service - REST API

Servicio REST desarrollado en Node.js con arquitectura hexagonal, desplegable con Argo CD en Kubernetes.

## 🚀 Características

- API REST para gestión de productos
- Arquitectura hexagonal
- Node.js 22 + Express
- PostgreSQL 16
- Docker multi-stage build
- Despliegue automatizado con ArgoCD
- CI/CD con GitHub Actions

## 📋 Prerrequisitos

- Node.js 22+
- Docker
- Kubernetes cluster
- ArgoCD instalado
- GitHub Actions configurado

## 🛠️ Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/jouncato/product-service-argo-cd.git
cd product-service-argo-cd

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar tests
npm test

# Construir Docker image
docker build -t product-service .

# Correr con Docker Compose
docker-compose up