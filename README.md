# Product Service - Cloud Native Application

This is a cloud-native Node.js application with PostgreSQL, designed for automatic deployment using ArgoCD and Kubernetes.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   ArgoCD        │ --> │   Kubernetes    │ --> │   Product       │
│                 │     │   Cluster       │     │   Service       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │                 │
                                               │   PostgreSQL    │
                                               │                 │
                                               └─────────────────┘
```

### Component Stack:
- **Backend**: Node.js 20 (Express.js)
- **Database**: PostgreSQL 16 (Alpine-based)
- **Container**: Docker
- **Orchestration**: Kubernetes
- **GitOps**: ArgoCD
- **CI/CD**: GitHub Actions
- **Image Registry**: Docker Hub

## Directory Structure

```
product-service/
├── src/
│   ├── application/
│   │   └── use_cases/
│   │       └── ProductUseCases.js
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── models/
│   │   │   │   └── Product.js
│   │   │   └── repositories/
│   │   │       └── ProductRepository.js
│   │   └── webserver/
│   │       ├── controllers/
│   │       │   ├── HealthController.js
│   │       │   └── ProductController.js
│   │       └── routes/
│   │           ├── healthRoutes.js
│   │           └── productRoutes.js
│   ├── config/
│   │   └── database.js
│   └── app.js
├── k8s/
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── postgresql-statefulset.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── argocd-application.yaml
├── scripts/
│   ├── build.sh
│   └── deploy.sh
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── Dockerfile
├── package.json
├── .env.example
└── README.md
```

## Prerequisites

- Docker and Docker Hub account
- Kubernetes cluster with ArgoCD installed
- kubectl configured to access your cluster
- Node.js 20+ (for local development)
- PostgreSQL client (optional)

## Quick Start

### 1. Local Development

```bash
# Clone the repository
git clone https://github.com/jouncato/product-service-argo-cd.git
cd product-service

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev

# Test the health endpoint
curl http://localhost:3000/api/health
```

### 2. Docker Build and Push

```bash
# Make the build script executable
chmod +x scripts/build.sh

# Build and push to Docker Hub
./scripts/build.sh

# Or manually:
docker build -t jpaezr/product-service-v1:latest .
docker push jpaezr/product-service-v1:latest
```

### 3. Kubernetes Deployment

#### Manual Deployment:

```bash
# Make the deploy script executable
chmod +x scripts/deploy.sh

# Deploy to Kubernetes
./scripts/deploy.sh

# Or manually:
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgresql-statefulset.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

#### ArgoCD Deployment:

```bash
# Apply ArgoCD application
kubectl apply -f k8s/argocd-application.yaml

# Sync the application in ArgoCD UI or CLI
argocd app sync product-service
```

## Environment Variables

| Variable      | Description              | Default                |
|--------------|--------------------------|------------------------|
| NODE_ENV     | Node environment         | production             |
| PORT         | Application port         | 3000                   |
| DB_NAME      | PostgreSQL database name | postgres               |
| DB_USER      | PostgreSQL username      | postgres               |
| DB_PASSWORD  | PostgreSQL password      | (set in secrets)       |
| DB_HOST      | PostgreSQL host          | postgresql-service     |
| DB_PORT      | PostgreSQL port          | 5432                   |

## API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | /api/health         | Health check endpoint    |
| POST   | /api/products       | Create a new product     |
| GET    | /api/products       | Get all products         |
| GET    | /api/products/:id   | Get a product by ID      |
| PUT    | /api/products/:id   | Update a product         |
| DELETE | /api/products/:id   | Delete a product         |

### Example API Calls:

```bash
# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "description": "High-performance laptop", "price": 999.99, "stock": 50}'

# Get all products
curl http://localhost:3000/api/products

# Get a product by ID
curl http://localhost:3000/api/products/1

# Update a product
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Laptop", "price": 899.99}'

# Delete a product
curl -X DELETE http://localhost:3000/api/products/1
```

## ArgoCD Configuration

The application uses GitOps practices with ArgoCD for continuous deployment.

### ArgoCD Application Overview:

- **Repository**: Your Git repository
- **Path**: `/k8s` directory
- **Sync Policy**: Automatic with self-healing enabled
- **Retry Policy**: 5 retries with exponential backoff

### ArgoCD Health Checks:

- **PostgreSQL**: Readiness and liveness probes using `pg_isready`
- **Product Service**: HTTP health checks on `/api/health`

## CI/CD Pipeline

GitHub Actions workflow automatically:

1. Builds Docker image
2. Pushes to Docker Hub
3. Updates Kubernetes manifests
4. Triggers ArgoCD sync

## Monitoring and Observability

### Health Checks:

- Application health: `GET /api/health`
- Container health: Docker HEALTHCHECK directive
- Kubernetes health: Readiness and liveness probes

### Logging:

- Application logs: stdout/stderr
- Container logs: `kubectl logs`
- ArgoCD sync logs: ArgoCD UI/CLI

## Security Considerations

1. **Non-root containers**: Application runs as user 1001
2. **Read-only filesystem**: Container filesystem is read-only
3. **Network policies**: Restrict traffic between services
4. **Secret management**: Sensitive data stored in Kubernetes secrets
5. **Resource limits**: CPU and memory limits enforced

## Troubleshooting

### Common Issues:

1. **PostgreSQL Connection Issues**:
   ```bash
   # Check PostgreSQL pod status
   kubectl get pod -l app=postgresql
   
   # Check logs
   kubectl logs postgresql-0
   
   # Test database connectivity
   kubectl exec -it product-service-<pod-id> -- nc -z postgresql-service 5432
   ```

2. **ArgoCD Sync Issues**:
   ```bash
   # Check ArgoCD application status
   argocd app get product-service
   
   # Force sync
   argocd app sync product-service --prune
   
   # Check sync logs
   argocd app logs product-service
   ```

3. **Deployment Rollout Issues**:
   ```bash
   # Check deployment status
   kubectl rollout status deployment/product-service
   
   # Describe deployment
   kubectl describe deployment product-service
   
   # Check events
   kubectl get events --sort-by=.metadata.creationTimestamp
   ```

### Debug Commands:

```bash
# Shell into product service container
kubectl exec -it deployment/product-service -- /bin/sh

# Check database connectivity
kubectl run pgclient --rm -it --image=postgres:16-alpine3.19 -- psql -h postgresql-service -U postgres

# View ArgoCD app resources
kubectl get applications.argoproj.io -n argocd

# Check ingress status
kubectl get ingress product-service-ingress
kubectl describe ingress product-service-ingress
```

## Backup and Recovery

### Database Backup:

```bash
# Create backup
kubectl exec postgresql-0 -- pg_dump -U postgres postgres > backup.sql

# Restore from backup
kubectl cp backup.sql postgresql-0:/tmp/backup.sql
kubectl exec postgresql-0 -- psql -U postgres postgres < /tmp/backup.sql
```

### Configuration Backup:

```bash
# Backup all Kubernetes manifests
kubectl get all -n default -o yaml > k8s-backup.yaml

# Backup secrets (be careful with this!)
kubectl get secrets -n default -o yaml > secrets-backup.yaml
```

## Performance Tuning

### Node.js Application:

- **Connection Pooling**: Configured in Sequelize (5 max connections)
- **Resource Limits**: 500m CPU, 512Mi memory
- **Horizontal Scaling**: 2 replicas with autoscaling possible

### PostgreSQL:

- **Persistent Storage**: 5Gi volume claim
- **Connection Limits**: Default PostgreSQL configuration
- **Resource Allocation**: 500m CPU, 512Mi memory

## Development Workflow

1. **Feature Development**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   npm test
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

2. **Pull Request**:
   - Create PR to main branch
   - CI pipeline runs automatically
   - Review and merge

3. **Automatic Deployment**:
   - CI builds and pushes new image
   - ArgoCD detects changes
   - Automatic rollout to production

## Scaling

### Horizontal Pod Autoscaling:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: product-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: product-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Advanced ArgoCD Features

### ApplicationSet Pattern:

For managing multiple environments:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: product-service-appset
  namespace: argocd
spec:
  generators:
  - list:
      elements:
      - env: dev
        url: https://kubernetes.default.svc
      - env: staging
        url: https://staging.kubernetes.cluster
      - env: prod
        url: https://prod.kubernetes.cluster
  template:
    metadata:
      name: '{{env}}-product-service'
    spec:
      project: default
      source:
        repoURL: https://github.com/your-org/product-service.git
        targetRevision: HEAD
        path: 'k8s/{{env}}'
      destination:
        server: '{{url}}'
        namespace: '{{env}}'
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
```

### Progressive Delivery with Argo Rollouts:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: product-service
spec:
  replicas: 5
  strategy:
    canary:
      steps:
      - setWeight: 20
      - pause: {duration: 1h}
      - setWeight: 40
      - pause: {duration: 30m}
      - setWeight: 60
      - pause: {duration: 30m}
      - setWeight: 80
      - pause: {duration: 30m}
      analysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: product-service
```

## Security Hardening Checklist

- [ ] Network policies implemented
- [ ] Pod security policies/standards enforced
- [ ] Secrets encrypted at rest
- [ ] TLS/SSL for all communications
- [ ] Regular security scans of container images
- [ ] Least privilege access for service accounts
- [ ] Regular password rotation
- [ ] Audit logging enabled

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## License

MIT License - See LICENSE file for details

## Support

For support, please create an issue in the GitHub repository or contact the DevOps team.


Last updated: May 2025