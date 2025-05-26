.PHONY: build run test migrate seed clean help

# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
BINARY_NAME=doctor-booking-api
DOCKER_COMPOSE=docker-compose

# Main targets
build: ## Build the application
	cd backend && $(GOBUILD) -o $(BINARY_NAME) .

run: ## Run the application
	cd backend && $(GOCMD) run .

test: ## Run tests
	cd backend && $(GOTEST) -v ./...

migrate: ## Run database migrations
	cd backend && $(GOCMD) run main.go migrate

seed: ## Seed the database with sample data
	cd backend/scripts && $(GOCMD) run seed.go

clean: ## Clean build files
	$(GOCLEAN)
	rm -f backend/$(BINARY_NAME)

# Docker commands
docker-build: ## Build the Docker image
	$(DOCKER_COMPOSE) build

docker-up: ## Start the application with Docker
	$(DOCKER_COMPOSE) up -d

docker-down: ## Stop the application and remove containers
	$(DOCKER_COMPOSE) down

docker-logs: ## View container logs
	$(DOCKER_COMPOSE) logs -f

help: ## Display this help message
	@echo "Usage: make [target]"
	@echo
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help
