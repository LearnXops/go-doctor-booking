<div align="center">
  <h1>🩺 Doctor Consultation Booking System</h1>
  <p>
    <strong>A modern, scalable platform connecting patients with healthcare providers</strong>
  </p>
  
</div>

A full-stack web application built with Go (Gin) and React that revolutionizes the way patients book medical appointments. The platform provides a seamless experience for patients to find and book appointments with healthcare providers, while giving doctors powerful tools to manage their schedules and patient interactions.



## 🛠 Technology Stack

### Backend
- **Language**: Go 1.20+
- **Framework**: [Gin Web Framework](https://github.com/gin-gonic/gin)
- **ORM**: [GORM](https://gorm.io/)
- **Authentication**: JWT & OAuth 2.0
- **Database**: 
  - Primary: PostgreSQL 13+
  - Caching: Redis
- **Search**: Elasticsearch (for doctor search)
- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Go testing, Testify, GoMock
- **CI/CD**: GitHub Actions
- **Containerization**: Docker

### Frontend
- **Framework**: React 18+
- **State Management**: React Context API
- **Styling**: 
  - Tailwind CSS
  - Headless UI
  - Hero Icons
- **Form Handling**: React Hook Form
- **Data Fetching**: React Query
- **Routing**: React Router v6
- **Internationalization**: i18next
- **Testing**: Jest, React Testing Library

### Infrastructure
- **Container Orchestration**: Kubernetes (EKS)
- **Infrastructure as Code**: Terraform
- **Cloud Provider**: AWS
  - EKS for Kubernetes
  - RDS for PostgreSQL
  - ElastiCache for Redis
  - OpenSearch for Elasticsearch
  - S3 for file storage
  - CloudFront CDN
  - Route 53 for DNS
- **Monitoring & Logging**:
  - Prometheus & Grafana
  - AWS CloudWatch
  - ELK Stack (Elasticsearch, Logstash, Kibana)
- **CI/CD**:
  - GitHub Actions
  - ArgoCD for GitOps
  - Helm for Kubernetes package management

## 🚀 Quick Start

### Prerequisites

- [Go 1.20+](https://golang.org/doc/install)
- [Node.js 18+](https://nodejs.org/)
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Terraform](https://www.terraform.io/downloads.html) (for infrastructure)
- [kubectl](https://kubernetes.io/docs/tasks/tools/) (for Kubernetes)
- [AWS CLI](https://aws.amazon.com/cli/) (for AWS deployments)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sandipdas/go-doctor-booking.git
   cd go-doctor-booking
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Frontend
   cp frontend/.env.example frontend/.env.local
   ```

3. **Start development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger/index.html
   - Database: localhost:5432 (postgres/postgres)

### Running Tests

```bash
# Backend tests
cd backend
go test -v ./...

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Prerequisites

- AWS account with appropriate permissions
- Configured AWS CLI
- Domain name (optional)

### 1. Infrastructure Setup

```bash
cd deployment/terraform

# Initialize Terraform
-backend-config=/back_end/production.tf 

# Review the execution plan
terraform plan

# Apply the configuration
terraform apply
```

### 2. Configure kubectl

```bash
aws eks --region $(terraform output -raw aws_region) update-kubeconfig --name $(terraform output -raw cluster_name)
```

### 3. Deploy Application

```bash
# For staging
kubectl apply -k deployment/k8s/overlays/staging

# For production
kubectl apply -k deployment/k8s/overlays/production
```

### 4. Access the Application

Get the application URL:

```bash
kubectl get ingress -n doctor-booking
```

For detailed deployment instructions, see the [deployment guide](deployment/README.md).

## 📚 Documentation

### API Reference

Interactive API documentation is available when the server is running:
- **Swagger UI**: `http://localhost:8080/swagger/index.html`
- **OpenAPI Spec**: `http://localhost:8080/swagger/doc.json`

### Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                 Frontend (React)                              │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────────────────────┐
│                               API Gateway                                      │
└───────────────┬───────────────┬───────────────────┬─────────────────────────┘
                │               │                   │
┌───────────────▼───┐   ┌────────▼───────┐   ┌──▼─────────────────────────┐
│   Auth Service    │   │  Appointments  │   │        Users              │
└───────────────────┘   └────────────────┘   └───────────────────────────┘
                                                                             
┌───────────────────────────────────────────────────────────────────────────────┐
│                                 PostgreSQL                                   │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Development Guides

- [Backend Development](docs/development/backend.md)
- [Frontend Development](docs/development/frontend.md)
- [Testing](docs/development/testing.md)
- [API Versioning](docs/development/api-versioning.md)

### Deployment

- [Infrastructure](deployment/README.md)
- [CI/CD Pipeline](.github/workflows/ci.yml)
- [Monitoring & Logging](docs/operations/monitoring.md)
- [Scaling](docs/operations/scaling.md)

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Report bugs** by opening an issue
2. **Suggest features** through GitHub issues
3. **Submit code** via pull requests

### Development Workflow

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Run tests and ensure all tests pass
5. Commit your changes with a descriptive message
6. Push to your fork and submit a pull request

### Code Style

- **Go**: Follow the [Effective Go](https://golang.org/doc/effective_go.html) guidelines
- **JavaScript/TypeScript**: Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Gin Web Framework](https://github.com/gin-gonic/gin) - HTTP web framework
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Kubernetes](https://kubernetes.io/) - Container orchestration
- [Terraform](https://www.terraform.io/) - Infrastructure as Code

## 📬 Contact

For questions or support, please open an issue or contact [your-email@example.com](mailto:your-email@example.com).

---

<div align="center">
  Made with ❤️ by Sandip Das | © 2025 Doctor Booking System
</div>
