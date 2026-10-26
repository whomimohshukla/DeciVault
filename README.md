# DeciVault

AI-powered organizational decision and knowledge management platform.

## Overview

DeciVault helps organizations capture, track, and manage decisions and knowledge in a structured, AI-enhanced environment. This repository contains the monorepo setup for the platform.

## Technology Stack

### Frontend

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Router](https://reactrouter.com/) - Routing
- [Axios](https://axios-http.com/) - HTTP client

### Backend

- [Node.js](https://nodejs.org/) - Runtime
- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Prisma ORM](https://www.prisma.io/) - Database toolkit
- [Zod](https://zod.dev/) - Schema validation
- [Helmet](https://helmetjs.github.io/) - Security middleware
- [Morgan](https://github.com/expressjs/morgan) - HTTP logging

### Development & Infrastructure

- [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) - Monorepo management
- [Docker Compose](https://docs.docker.com/compose/) - Local PostgreSQL
- [Vitest](https://vitest.dev/) - Testing framework
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) - Code quality

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker and Docker Compose (for local PostgreSQL)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd decivault
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit the `.env` files with your local configuration.

## Environment Setup

### Root (.env)

```env
POSTGRES_USER=decivault
POSTGRES_PASSWORD=decivault_dev
POSTGRES_DB=decivault
POSTGRES_PORT=5432
```

### Backend (backend/.env)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://decivault:decivault_dev@localhost:5432/decivault
CORS_ORIGIN=http://localhost:5173
```

### Frontend (frontend/.env)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Starting PostgreSQL

Start the local PostgreSQL database using Docker Compose:

```bash
npm run db:up
```

Stop the database:

```bash
npm run db:down
```

## Running the Application

### Development mode (both frontend and backend)

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health check: http://localhost:3000/api/health

### Run separately

```bash
# Frontend only
npm run dev -w frontend

# Backend only
npm run dev -w backend
```

## Development Commands

### Type checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Testing

```bash
npm run test
```

### Building

```bash
npm run build
```

### Prisma Commands

```bash
# Generate Prisma Client
npm run db:generate

# Validate Prisma schema
npm run db:validate
```

## Project Structure

```
decivault/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/ # Reusable components (ui, layout)
│   │   ├── pages/      # Page components
│   │   ├── routes/     # Route configuration
│   │   ├── services/   # API services
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utilities and configurations
│   │   ├── types/      # TypeScript types
│   │   └── ...
├── backend/            # Express + TypeScript backend
│   ├── prisma/         # Prisma schema and migrations
│   ├── src/
│   │   ├── config/     # Configuration
│   │   ├── middleware/ # Express middleware
│   │   ├── modules/    # Feature modules (placeholder structure)
│   │   ├── routes/     # Route definitions
│   │   ├── app.ts      # Express app setup
│   │   └── server.ts   # Server entry point
│   └── tests/          # Test files
├── docs/               # Documentation
├── .github/workflows/  # CI configuration
└── docker-compose.yml  # Local PostgreSQL setup
```

See [docs/architecture.md](docs/architecture.md) for detailed architecture information.

# DeciVault


