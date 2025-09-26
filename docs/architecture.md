# Doctor Booking System Architecture

This document outlines the architecture of the Doctor Booking System.

## System Architecture Diagram

```mermaid
graph TD
    subgraph "Frontend"
        FE[Frontend Vue.js App]
        FE_DEV[Development Environment]
        FE_PROD[Production Environment]
    end

    subgraph "Backend"
        API[Go API Server]
        subgraph "API Layers"
            ROUTES[API Routes]
            MIDDLEWARE[Middleware]
            CONTROLLERS[Controllers]
            MODELS[Data Models]
        end
    end

    subgraph "Database"
        DB[(PostgreSQL)]
    end

    FE_DEV --> |HTTP Requests| API
    FE_PROD --> |HTTP Requests| API
    
    API --> |SQL Queries| DB
    
    ROUTES --> MIDDLEWARE
    MIDDLEWARE --> CONTROLLERS
    CONTROLLERS --> MODELS
    MODELS --> DB

    subgraph "Infrastructure"
        DOCKER[Docker Containers]
    end

    DOCKER --> FE_DEV
    DOCKER --> FE_PROD
    DOCKER --> API
    DOCKER --> DB

classDef frontend fill:#42b883,stroke:#333,stroke-width:1px;
classDef backend fill:#00ADD8,stroke:#333,stroke-width:1px;
classDef database fill:#336791,stroke:#333,stroke-width:1px;
classDef infrastructure fill:#1488C6,stroke:#333,stroke-width:1px;

class FE,FE_DEV,FE_PROD frontend;
class API,ROUTES,MIDDLEWARE,CONTROLLERS,MODELS backend;
class DB database;
class DOCKER infrastructure;
```

## Component Details

### Frontend
- **Technology**: Vue.js with TypeScript
- **Development Environment**: Hot-reloading enabled, runs on port 5173
- **Production Environment**: Nginx-served static files, runs on port 8081
- **Key Features**: User authentication, appointment booking, doctor profiles

### Backend
- **Technology**: Go (Golang)
- **API Structure**:
  - Routes: Define API endpoints
  - Middleware: Authentication, logging, error handling
  - Controllers: Business logic implementation
  - Models: Data structures and database interactions
- **Runs on port**: 8080

### Database
- **Technology**: PostgreSQL 13
- **Runs on port**: 5432
- **Stores**: User accounts, doctor profiles, appointments, etc.

### Infrastructure
- **Containerization**: Docker with docker-compose
- **Networks**: Bridge network for service communication
- **Volumes**: Persistent storage for database
