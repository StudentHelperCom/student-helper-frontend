# ==============================================================================
# MAKEFILE - Student Helper Frontend
# ==============================================================================
# Purpose: Simplify Docker commands with easy-to-remember shortcuts
# Usage: make <target>
# Example: make build, make up, make logs
# ==============================================================================

# Variables
IMAGE_NAME = student-helper-frontend
CONTAINER_NAME = student-helper-frontend
COMPOSE_FILE = docker-compose.yml

# Default target - shows help
.DEFAULT_GOAL := help

# PHONY targets don't represent actual files
.PHONY: help build up down restart logs shell clean prune health stats test

# ==============================================================================
# HELP - Show available commands
# ==============================================================================
help: ## Show this help message
	@echo "=========================================="
	@echo "Student Helper Frontend - Docker Commands"
	@echo "=========================================="
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make build   - Build Docker image"
	@echo "  make up      - Start containers"
	@echo "  make logs    - View logs"

# ==============================================================================
# BUILD COMMANDS
# ==============================================================================
build: ## Build Docker image (with cache)
	@echo "🏗️  Building Docker image..."
	docker-compose build

build-no-cache: ## Build Docker image without cache (clean build)
	@echo "🏗️  Building Docker image (no cache)..."
	docker-compose build --no-cache

rebuild: ## Rebuild and restart containers
	@echo "🔄 Rebuilding and restarting..."
	docker-compose up -d --build --force-recreate

# ==============================================================================
# RUN COMMANDS
# ==============================================================================
up: ## Start containers in detached mode
	@echo "🚀 Starting containers..."
	docker-compose up -d

down: ## Stop and remove containers
	@echo "🛑 Stopping containers..."
	docker-compose down

restart: ## Restart containers
	@echo "🔄 Restarting containers..."
	docker-compose restart

stop: ## Stop containers (without removing)
	@echo "⏸️  Stopping containers..."
	docker-compose stop

start: ## Start existing containers
	@echo "▶️  Starting containers..."
	docker-compose start

# ==============================================================================
# MONITORING & DEBUGGING
# ==============================================================================
logs: ## Show container logs (live)
	@echo "📋 Showing logs (Ctrl+C to exit)..."
	docker-compose logs -f frontend

logs-all: ## Show all container logs
	@echo "📋 Showing all logs..."
	docker-compose logs -f

ps: ## List running containers
	@echo "📦 Running containers:"
	docker-compose ps

stats: ## Show container resource usage
	@echo "📊 Container stats (Ctrl+C to exit):"
	docker stats $(CONTAINER_NAME)

health: ## Check container health status
	@echo "🏥 Health status:"
	@docker inspect --format='{{.State.Health.Status}}' $(CONTAINER_NAME) 2>/dev/null || echo "Container not running"

inspect: ## Show detailed container information
	@echo "🔍 Container details:"
	docker inspect $(CONTAINER_NAME)

# ==============================================================================
# SHELL ACCESS
# ==============================================================================
shell: ## Open shell in running container
	@echo "🐚 Opening shell in container..."
	docker exec -it $(CONTAINER_NAME) sh

root-shell: ## Open root shell in running container (for debugging)
	@echo "🔓 Opening root shell (use carefully!)..."
	docker exec -it -u root $(CONTAINER_NAME) sh

# ==============================================================================
# TESTING
# ==============================================================================
test: ## Test if application is running
	@echo "🧪 Testing application..."
	@curl -f http://localhost:3000/api/health || echo "❌ Health check failed"
	@echo "✅ Application is responding"

# ==============================================================================
# CLEANUP COMMANDS
# ==============================================================================
clean: ## Stop containers and remove volumes
	@echo "🧹 Cleaning up..."
	docker-compose down -v

clean-all: ## Remove containers, volumes, and images
	@echo "🗑️  Removing everything..."
	docker-compose down -v --rmi all

prune: ## Remove unused Docker resources (containers, networks, images)
	@echo "🧹 Pruning Docker resources..."
	docker system prune -f

prune-all: ## Remove ALL unused Docker resources (including volumes)
	@echo "⚠️  WARNING: This will remove ALL unused Docker resources!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker system prune -a --volumes -f; \
	fi

# ==============================================================================
# ENVIRONMENT & CONFIGURATION
# ==============================================================================
env-check: ## Check if .env file exists
	@echo "🔍 Checking environment configuration..."
	@if [ -f .env ]; then \
		echo "✅ .env file exists"; \
		echo "📋 Environment variables:"; \
		cat .env | grep -v "^#" | grep -v "^$$"; \
	else \
		echo "❌ .env file not found!"; \
		echo "💡 Create .env file with required variables"; \
		exit 1; \
	fi

config: ## Validate docker-compose configuration
	@echo "✅ Validating docker-compose.yml..."
	docker-compose config

# ==============================================================================
# IMAGE MANAGEMENT
# ==============================================================================
images: ## List Docker images
	@echo "🖼️  Docker images:"
	docker images | grep $(IMAGE_NAME) || echo "No images found"

tag: ## Tag image for registry (usage: make tag VERSION=1.0.0)
	@if [ -z "$(VERSION)" ]; then \
		echo "❌ VERSION not specified"; \
		echo "Usage: make tag VERSION=1.0.0"; \
		exit 1; \
	fi
	@echo "🏷️  Tagging image as $(IMAGE_NAME):$(VERSION)"
	docker tag $(IMAGE_NAME):latest $(IMAGE_NAME):$(VERSION)

# ==============================================================================
# USEFUL COMBINATIONS
# ==============================================================================
dev: build up logs ## Build, start, and show logs (for development)

fresh: clean build up ## Clean rebuild and start

quick-restart: down up ## Quick restart without rebuild

# ==============================================================================
# INFORMATION
# ==============================================================================
version: ## Show Docker and docker-compose versions
	@echo "🐳 Docker version:"
	@docker --version
	@echo ""
	@echo "🎼 Docker Compose version:"
	@docker-compose --version

info: ## Show comprehensive information
	@echo "=========================================="
	@echo "Student Helper Frontend - System Info"
	@echo "=========================================="
	@echo ""
	@make version
	@echo ""
	@echo "📦 Container status:"
	@docker ps -a | grep $(CONTAINER_NAME) || echo "Container not found"
	@echo ""
	@echo "🖼️  Image info:"
	@docker images $(IMAGE_NAME)
	@echo ""
	@echo "💾 Disk usage:"
	@docker system df
