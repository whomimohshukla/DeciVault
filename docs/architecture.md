# DeciVault Architecture

## Overview

DeciVault is an AI-powered organizational decision and knowledge management platform built as a monorepo with clear separation of concerns between frontend, backend, database, and future AI/background-processing components.

## Architecture Principles

- **Separation of concerns**: Frontend handles presentation, backend handles business logic and data access
- **Modular design**: Backend organized by domain modules for scalability
- **Type safety**: Full TypeScript across the stack
- **Secure by default**: Security middleware, input validation, and environment-based configuration
- **Extensible**: Architecture designed to accommodate future AI and background processing components

## System Components

### Frontend (React + Vite + TypeScript)
- **Presentation Layer**: React components organized by UI primitives, layouts, and pages
- **Routing**: React Router for client-side navigation
- **State Management**: Context API for shared state
- **API Communication**: Centralized Axios client with environment-based configuration
- **Styling**: Tailwind CSS for utility-first styling

### Backend (Node.js + Express + TypeScript)
- **API Layer**: Express REST API with modular route organization
- **Application Layer**: Service layer for business logic (to be implemented per module)
- **Data Access Layer**: Prisma ORM with PostgreSQL for database operations
- **Validation**: Zod for request validation and environment variable validation
- **Middleware**: CORS, Helmet for security, Morgan/Pino for logging
- **Error Handling**: Centralized error handling and not-found middleware

### Database (PostgreSQL)
- **Primary Data Store**: PostgreSQL relational database
- **ORM**: Prisma for type-safe database access and migrations
- **Schema Management**: Prisma migrations for version-controlled schema changes

### Future Components (Planned, Not Yet Implemented)
- **AI Services**: Integration with AI providers for decision insights and knowledge extraction
- **Background Processing**: Job queues for async tasks like document processing and AI analysis
- **Search**: Enhanced search capabilities across documents and decisions
- **Audit Logging**: Comprehensive audit trail for organizational decisions

## Data Flow

1. Frontend makes HTTP requests to backend API via Axios client
2. Backend validates requests using Zod middleware
3. Business logic processes requests in service layer
4. Data access layer uses Prisma to interact with PostgreSQL
5. Responses flow back through the stack to the frontend

## Security Considerations

- Environment variables for sensitive configuration
- Helmet middleware for security headers
- CORS configuration for cross-origin requests
- Input validation with Zod
- Type-safe database queries with Prisma
- No secrets committed to version control
