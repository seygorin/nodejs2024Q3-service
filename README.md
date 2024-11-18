# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager
- Docker Desktop - [Download & Install Docker](https://www.docker.com/products/docker-desktop/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/seygorin/nodejs2024Q3-service
cd nodejs2024Q3-service
```

2. Change .env file in the root directory if you want to change the default port or database credentials.

## Running Application

### Using Docker (Recommended)

1. Build and start containers:
```bash
npm run docker:build  # Build containers
npm run docker:up     # Start containers and wait a bit
```

2. View logs:
```bash
npm run docker:logs
```

3. Access services:
- API: http://localhost:4000 (default)
- Swagger UI: http://localhost:4000/api
- Prisma Studio: http://localhost:5555 (after running `npm run prisma:studio`)

4. Stop application:
```bash
npm run docker:down
```

### Using Local Environment

1. Install dependencies:
```bash
npm install
```

2. Start the application:
```bash
npm run start        # Production mode
npm run start:dev    # Development mode with watch
```

## Database Management

Access and manage database using Prisma Studio:
```bash
npm run prisma:studio
```

Generate Prisma client after schema changes:
```bash
npm run prisma:generate
```

## Testing

Run tests:
```bash
npm run test         # Run all tests without authorization
```

## Code Quality

Format and lint code:
```bash
npm run format  # Format code using Prettier
npm run lint    # Lint and auto-fix using ESLint
```

## Security

Scan for vulnerabilities:
```bash
npm run scan
```

## API Documentation

After starting the application, you can explore the API documentation:
- Swagger UI: http://localhost:4000/api
- OpenAPI specification: Available in `/doc` folder (api.yaml and api.json)

## Docker Image

The application image is available on Docker Hub:
```bash
docker pull seygorin/nodejs2024q3:latest
```

Or by [link](https://hub.docker.com/r/seygorin/nodejs2024q3).
