# Fortune Cookie App - Presentation Guide

## 📊 Presentation Outline (15-20 minutes)

---

## 1. PROJECT OVERVIEW (2 minutes)

### What is Fortune Cookie App?
- A React-based web application that displays random fortune messages
- Built with modern tech stack: React, TypeScript, Vite, Tailwind CSS
- Fully containerized and deployed to Kubernetes

### Key Features
- ✨ Beautiful UI with ShadCN components
- 🐳 Docker containerization
- ☸️ Kubernetes deployment
- 🔄 CI/CD pipeline with GitHub Actions
- 📊 Production-ready setup

---

## 2. LIVE DEMONSTRATION (10-12 minutes)

### A. Show the Running Application

**Step 1: Access the App**
```bash
# Option 1: Using Docker Compose
docker-compose up -d
# Visit: http://localhost:8080

# Option 2: Using Kubernetes (Minikube)
kubectl port-forward svc/fortune-cookie-service 8080:80 -n fortune-cookie
# Visit: http://localhost:8080

# Option 3: Direct Minikube service
minikube service fortune-cookie-service -n fortune-cookie
```

**Demo Points:**
- Show the application loading
- Click to display fortune messages
- Show responsive design (resize browser)
- Check browser console for any errors
- Show the /health endpoint: http://localhost:8080/health

---

### B. Demonstrate Docker Setup

**Step 2: Show Docker Files**
```bash
# Open and explain key files in terminal
cat Dockerfile
cat docker-compose.yml
cat .dockerignore
cat nginx.conf
```

**Key Points to Explain:**
1. **Dockerfile**: Multi-stage build
   - Stage 1: Node 18 Alpine - builds the app
   - Stage 2: Nginx Alpine - serves the app
   - Size optimization & security

2. **docker-compose.yml**: Easy local testing
   - Service definition
   - Port mapping (8080→80)
   - Health checks
   - Network configuration

3. **nginx.conf**: Production-ready config
   - Gzip compression
   - Security headers
   - Rate limiting
   - Static file caching

**Demo Build Process:**
```bash
# Build the image
docker build -t fortune-cookie:latest .

# Check image size
docker images | grep fortune-cookie

# Run locally
docker run -d -p 8080:80 --name test-app fortune-cookie:latest
docker logs test-app
curl http://localhost:8080/health

# Clean up
docker stop test-app && docker rm test-app
```

---

### C. Show Kubernetes Deployment

**Step 3: Kubernetes Architecture**
```bash
# Check cluster info
kubectl cluster-info
kubectl get nodes

# Show fortune-cookie namespace
kubectl get ns | grep fortune-cookie

# Show all resources
kubectl get all -n fortune-cookie
```

**Demo Output:**
```
NAME                                READY   STATUS    RESTARTS   AGE
pod/fortune-cookie-app-7d7c8b5945-fdk6n   1/1     Running   0          20m
pod/fortune-cookie-app-7d7c8b5945-mbbqz   1/1     Running   0          20m
pod/fortune-cookie-app-c8dc4644-92t9r     1/1     Running   0          20m

NAME                             TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)
service/fortune-cookie-service   LoadBalancer   10.110.176.116   <pending>     80:32110/TCP
```

**Key Points:**
- 3 replicas running for high availability
- LoadBalancer service for external access
- Automatic health checks
- Pod anti-affinity (spread across nodes)

---

### D. Show Deployment Configuration

**Step 4: Explain Kubernetes Files**
```bash
# Show deployment YAML
cat k8s/deployment.yaml

# Show config and secrets
cat k8s/configmap-secret.yaml
```

**Highlight in Presentation:**
```yaml
# Deployment features to showcase:
- replicas: 3                          # High availability
- Rolling update strategy              # Zero downtime
- Resource limits & requests           # Right-sizing
- Health checks (liveness/readiness)   # Auto-healing
- Security context (non-root user)     # Security
- HorizontalPodAutoscaler (3-10 pods)  # Auto-scaling
- PodDisruptionBudget                  # Reliability
```

---

### E. Demonstrate Auto-scaling

**Step 5: Show HPA in Action**
```bash
# Check current HPA status
kubectl get hpa -n fortune-cookie
kubectl describe hpa fortune-cookie-hpa -n fortune-cookie

# Expected output shows:
# - Current CPU/Memory usage
# - Min/Max replicas (3-10)
# - Scaling thresholds (70% CPU, 80% Memory)
```

---

### F. Show Logs & Monitoring

**Step 6: Container Logs**
```bash
# View logs from all pods
kubectl logs -l app=fortune-cookie -n fortune-cookie --tail=50 -f

# View logs from specific pod
kubectl logs <pod-name> -n fortune-cookie

# Check pod events
kubectl describe pod <pod-name> -n fortune-cookie
```

---

## 3. FILE STRUCTURE SHOWCASE (2 minutes)

### Project Organization
```bash
tree -L 3 -a

# Or show key directories:
ls -la                 # Root files
ls -la .github/        # CI/CD
ls -la k8s/            # Kubernetes
ls -la src/            # Application code
ls -la dist/           # Built app
```

### Key Files to Show

**1. Configuration Files**
```bash
# Docker
- Dockerfile          (18 lines - multi-stage build)
- docker-compose.yml  (47 lines - local dev setup)
- .dockerignore       (17 lines - build optimization)
- nginx.conf          (80 lines - web server config)

# Kubernetes  
- k8s/deployment.yaml      (185 lines - complete K8s setup)
- k8s/configmap-secret.yaml (48 lines - config management)

# CI/CD
- .github/workflows/deploy.yml (140 lines - GitHub Actions)
```

**2. Application Source**
```bash
# Core files
src/
├── main.tsx           # Entry point
├── App.tsx            # Main component
├── index.css          # Global styles
└── components/
    ├── FortuneCard.tsx
    └── ui/            # ShadCN components

# Build output
dist/
├── index.html
├── assets/
│   ├── index-*.js     # Bundled JS
│   ├── index-*.css    # Bundled CSS
│   └── fortune-bg-*.jpg
```

**3. Configuration**
```bash
# Package & Build
- package.json        (Build scripts, dependencies)
- vite.config.ts      (Build optimization)
- tsconfig.json       (TypeScript config)
- tailwind.config.ts  (Styling)

# Environment
- .env.example        (Template for env vars)
- .dockerignore       (Docker optimization)
```

---

## 4. TECHNICAL DETAILS (3-4 minutes)

### A. Docker Multi-Stage Build Explanation
```dockerfile
# Stage 1: Build (only for compilation)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime (small, secure image)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

**Benefits:**
- ✅ Final image size: ~50MB (vs 500MB+ with single stage)
- ✅ No build dependencies in production
- ✅ Faster deployments
- ✅ Better security (attack surface reduced)

---

### B. Kubernetes Architecture

**Show Diagram/Explain:**
```
┌─────────────────────────────────────────┐
│         Kubernetes Cluster              │
│                                         │
│  ┌────────────────────────────────┐    │
│  │    fortune-cookie Namespace    │    │
│  │                                │    │
│  │  ┌──────────────────────────┐  │    │
│  │  │   Deployment (3 replicas)│  │    │
│  │  │  ┌────────┐┌────────┐   │  │    │
│  │  │  │  Pod 1 ││  Pod 2 │...│  │    │
│  │  │  └────────┘└────────┘   │  │    │
│  │  └──────────────────────────┘  │    │
│  │                                │    │
│  │  ┌──────────────────────────┐  │    │
│  │  │  LoadBalancer Service    │  │    │
│  │  │  Port: 80 (external)     │  │    │
│  │  └──────────────────────────┘  │    │
│  │                                │    │
│  │  ┌──────────────────────────┐  │    │
│  │  │  HPA (3-10 replicas)     │  │    │
│  │  │  Scales on CPU/Memory    │  │    │
│  │  └──────────────────────────┘  │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Key Components:**
1. **Deployment**: Manages pods, ensures 3 always running
2. **Service**: Exposes pods to external traffic
3. **HPA**: Auto-scales based on resource usage
4. **ConfigMap/Secrets**: Manages configuration
5. **PDB**: Ensures availability during disruptions

---

### C. CI/CD Pipeline Flow

**Show GitHub Actions Workflow:**
```
Code Push to Main
        ↓
┌──────────────────────────────────────┐
│  Build & Push Docker Image           │
│  - Build image                       │
│  - Tag with branch/version           │
│  - Push to Docker Hub                │
└──────────────────────────────────────┘
        ↓
┌──────────────────────────────────────┐
│  Security Scanning (Trivy)           │
│  - Scan for vulnerabilities          │
│  - Check critical issues             │
│  - Report to GitHub                  │
└──────────────────────────────────────┘
        ↓
┌──────────────────────────────────────┐
│  Deploy to Kubernetes                │
│ - Apply ConfigMap/Secrets            │
│ - Update deployment image            │
│ - Wait for rollout (5m timeout)      │
│ - Run health checks                  │
└──────────────────────────────────────┘
        ↓
Deployment Complete ✅
```

---

## 5. TESTING & VALIDATION (2-3 minutes)

### A. Container Health Check
```bash
# Check container is healthy
curl http://localhost:8080/health
# Expected: 200 OK with "healthy" response

# Check nginx is serving files
curl -v http://localhost:8080/
# Expected: 200 OK with HTML content
```

### B. Kubernetes Health Checks
```bash
# Check pod readiness
kubectl get pods -n fortune-cookie

# Check service endpoints
kubectl get endpoints fortune-cookie-service -n fortune-cookie

# Check service is accessible
kubectl exec -it <pod-name> -n fortune-cookie -- curl localhost/health
```

### C. Load Testing (Optional)
```bash
# Simple load test with curl
for i in {1..10}; do
  curl -s http://localhost:8080 > /dev/null
  echo "Request $i completed"
done

# Check pod CPU/memory usage
kubectl top pods -n fortune-cookie
```

---

## 6. GITHUB REPOSITORY SHOWCASE (2 minutes)

### Show on GitHub.com

1. **Repository Structure**
   - Navigate to: https://github.com/tashivxo/fortuneCookie
   - Show folder structure (Dockerfile, k8s/, .github/)

2. **GitHub Actions**
   - Click "Actions" tab
   - Show recent workflow runs
   - Click a successful run to show:
     - Build logs
     - Image pushed to Docker Hub
     - Deployment confirmation

3. **Commits & History**
   - Show git commits
   - Highlight deployment-related commits
   - Explain version control in CI/CD

---

## 7. DOCKER HUB SHOWCASE (1 minute)

```bash
# Show Docker Hub
# Navigate to: https://hub.docker.com/r/tashivxo/fortune-cookie

# Show image details:
docker pull tashivxo/fortune-cookie:latest
docker inspect tashivxo/fortune-cookie:latest | jq '.[] | {Tags, Architecture, Size}'
```

---

## TALKING POINTS SUMMARY

### What Makes This Production-Ready?

✅ **Containerization**
- Multi-stage Docker builds for efficiency
- Small, secure base images (Alpine)
- Non-root user execution
- Health checks built-in

✅ **Orchestration**
- Kubernetes deployment with 3 replicas
- Automatic health monitoring
- Pod disruption budgets
- Pod anti-affinity (spread across nodes)
- Auto-scaling (HPA 3-10 replicas)

✅ **Networking & Security**
- LoadBalancer service for external access
- Nginx with security headers
- Rate limiting configured
- Read-only root filesystem
- Non-root container user

✅ **Automation**
- GitHub Actions CI/CD
- Automatic Docker image building
- Security scanning (Trivy)
- Automated Kubernetes deployment
- Rollout health checks

✅ **Reliability**
- Rolling update strategy (zero downtime)
- Liveness & readiness probes
- Resource limits (prevent resource starvation)
- Persistent logs
- Recovery from failures

---

## QUICK COMMAND REFERENCE

```bash
# Docker
docker build -t fortune-cookie:latest .
docker-compose up -d
docker logs -f <container-id>
docker-compose down

# Kubernetes
kubectl apply -f k8s/
kubectl get all -n fortune-cookie
kubectl logs -l app=fortune-cookie -n fortune-cookie -f
kubectl port-forward svc/fortune-cookie-service 8080:80 -n fortune-cookie

# Testing
curl http://localhost:8080/health
kubectl describe pod <pod-name> -n fortune-cookie
kubectl top pods -n fortune-cookie
```

---

## EXPECTED DEMO FLOW

1. **(0:00)** Start application & show it working
2. **(2:00)** Show Docker setup & files
3. **(5:00)** Demonstrate Docker build process
4. **(7:00)** Show Kubernetes dashboard/resources
5. **(10:00)** Explain deployment YAML
6. **(12:00)** Show CI/CD workflow on GitHub
7. **(14:00)** Run tests & show health checks
8. **(16:00)** Show GitHub Actions build logs
9. **(18:00)** Q&A / Closing remarks

---

## SCREENSHOTS TO CAPTURE

📸 **Recommended Screenshots:**
1. Application running in browser
2. `kubectl get all -n fortune-cookie` output
3. Docker image build success
4. GitHub Actions workflow success
5. Docker Hub image page
6. Pod logs showing app startup
7. Health check endpoint response
8. Kubernetes deployment YAML
9. File structure in IDE
10. Architecture diagram

---

## PRESENTATION TIPS

✨ **Do's:**
- Start with running application
- Use real-time demos (not slides)
- Explain WHY, not just WHAT
- Show actual code/configs
- Pause for questions
- Have backup commands ready

⚠️ **Don'ts:**
- Don't read slides verbatim
- Don't go too deep into code
- Don't skip the "why" of architecture
- Don't demo without internet (download images first)
- Don't have all terminals open (confusing)

---

## BONUS: PRODUCTION CHECKLIST

If asked about production deployment:

✅ Use managed Kubernetes (EKS, AKS, GKE)
✅ Set up proper RBAC & network policies
✅ Use private Docker registry (not public)
✅ Set up monitoring (Prometheus, Grafana)
✅ Configure logging (ELK, Fluentd)
✅ Set up ingress with TLS/SSL
✅ Use sealed secrets for sensitive data
✅ Configure backup & disaster recovery
✅ Set up proper alerting & on-call
✅ Document runbooks for incidents
