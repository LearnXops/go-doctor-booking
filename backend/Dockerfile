# Build stage
FROM golang:1.20-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy go mod and sum files
COPY go.mod go.sum ./


# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app/

# Copy the binary from builder
COPY --from=builder /app/main .

# Copy the .env file
COPY --from=builder /app/.env .

# Copy the templates directory if you have any
# COPY --from=builder /app/templates ./templates

# Expose port
EXPOSE 8080

# Command to run the executable
CMD ["/app/main"]
