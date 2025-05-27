# Doctor Consultation Booking System

A full-stack web application for booking doctor consultations built with Go (Gin) and React. This application allows patients to book appointments with doctors, manage their profiles, and view appointment history. Doctors can manage their schedules and view upcoming appointments.

## ✨ Features

- **User Authentication**
  - Patient and Doctor registration and login
  - JWT-based authentication
  - Role-based access control

- **Patient Features**
  - Search and view doctor profiles
  - Book, reschedule, and cancel appointments
  - View appointment history
  - Update profile information

- **Doctor Features**
  - Manage profile and availability
  - View and manage appointments
  - Set consultation fees and specialties
  - Dashboard with appointment statistics

- **Admin Features**
  - Manage users (activate/deactivate)
  - View system-wide statistics
  - Monitor all appointments

## 🛠 Tech Stack

- **Backend**: 
  - Go 1.20+
  - Gin Web Framework
  - GORM ORM
  - JWT Authentication
  - PostgreSQL
  - Swagger for API documentation

- **Frontend**:
  - React.js 18+
  - React Router
  - Axios for API calls
  - Tailwind CSS for styling
  - React Context for state management

## 🚀 Getting Started

### Prerequisites

- Go 1.20+ ([Installation Guide](https://golang.org/doc/install))
- Node.js 16+ and npm ([Download Node.js](https://nodejs.org/))
- PostgreSQL 13+ ([Download PostgreSQL](https://www.postgresql.org/download/))
- Git ([Download Git](https://git-scm.com/downloads))

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sandipdas/go-doctor-booking.git
   cd go-doctor-booking/backend
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials and other settings.

3. **Install dependencies**
   ```bash
   go mod download
   ```

4. **Database setup**
   - Create a new PostgreSQL database
   - Update the database connection string in `.env`
   - Run migrations:
     ```bash
     go run main.go migrate
     ```

5. **Start the server**
   ```bash
   go run main.go
   ```
   The API will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 📚 API Documentation

Interactive API documentation is available when the server is running:
- Swagger UI: `http://localhost:8080/swagger/index.html`
- JSON Docs: `http://localhost:8080/swagger/doc.json`

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login

### Users
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update user profile

### Doctors
- `GET /api/v1/doctors` - List all doctors
- `GET /api/v1/doctors/:id` - Get doctor details
- `GET /api/v1/doctors/dashboard` - Doctor dashboard
- `POST /api/v1/doctors/schedules` - Create doctor schedule
- `GET /api/v1/doctors/appointments` - Get doctor's appointments

### Appointments
- `POST /api/v1/patients/appointments` - Book an appointment
- `GET /api/v1/patients/appointments` - Get patient's appointments
- `PUT /api/v1/patients/appointments/:id/cancel` - Cancel an appointment

## 🔧 Environment Variables

See `.env.example` for all available environment variables. Key variables include:

```
# Server
PORT=8080
ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=doctor_booking

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h
```

## 🧪 Testing

Run integration tests:
```bash
cd backend
go test -v ./tests/integration/...
```

## 🐳 Docker Compose

This project uses Docker Compose to manage multiple services in development and production environments.

### Services Overview

The `docker-compose.yml` defines the following services:

1. **db** - PostgreSQL database service
   - Port: 5432 (mapped to host)
   - Database: `doctor_booking`
   - Credentials: postgres/postgres
   - Data is persisted in a Docker volume

2. **api** - Backend API service
   - Port: 8080 (mapped to host)
   - Environment: development
   - Automatically connects to the database
   - Hot-reload enabled in development

3. **frontend-dev** - Development frontend
   - Port: 5173 (mapped to host)
   - Hot-reloading enabled
   - Uses local files via volume mounts

4. **frontend-prod** - Production frontend
   - Port: 8081 (mapped to host)
   - Serves built static files via Nginx
   - Optimized for production use

### Prerequisites

- Docker Engine 20.10.0+
- Docker Compose 2.0.0+

### Quick Start

1. **Build and start all services**
   ```bash
   docker-compose up -d --build
   ```

2. **Access the services**
   - Frontend (Development): http://localhost:5173
   - Frontend (Production): http://localhost:8081
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger
   - Database: localhost:5432 (use `doctor_booking` database)

### Common Commands

**Start services** (in background):
```bash
docker-compose up -d
```

**Stop all services**:
```bash
docker-compose down
```

**Rebuild and restart services**:
```bash
docker-compose up -d --build
```

**View logs**:
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f frontend-dev
docker-compose logs -f db
```

**Run a command in a service**:
```bash
docker-compose exec api sh
docker-compose exec db psql -U postgres
```

### Development Workflow

1. **Frontend Development**
   - The `frontend-dev` service has hot-reloading enabled
   - Changes to files in the `frontend` directory will be reflected immediately
   - Access at http://localhost:5173

2. **Backend Development**
   - The `api` service restarts automatically on code changes
   - Environment variables can be set in `.env` or in `docker-compose.yml`

3. **Database Management**
   - Access the database using:
     ```bash
     docker-compose exec db psql -U postgres -d doctor_booking
     ```
   - Data is persisted in a Docker volume named `postgres_data`

### Production Deployment

For production, it's recommended to:
1. Set `NODE_ENV=production` and `ENV=production`
2. Use the `frontend-prod` service which serves optimized static files
3. Configure proper SSL/TLS for all services
4. Set up proper database backups

### Environment Variables

Key environment variables used in Docker Compose:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=doctor_booking

# Backend
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=doctor_booking
JWT_SECRET=your_jwt_secret_key_here
ENV=development

# Frontend
VITE_API_BASE_URL=http://localhost:8080/api/v1
NODE_ENV=development
```

### Troubleshooting

- **Port conflicts**: Ensure ports 5432, 8080, 8081, and 5173 are available
- **Build issues**: Run `docker-compose build --no-cache` to force a clean build
- **Database connection issues**: Verify the database is running and accessible from the API container

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Gin Web Framework
- GORM ORM
- React.js
- And all the amazing open-source libraries used in this project
