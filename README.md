# MentorAI Project - Structure & Objectives

## 📋 Project Overview

**MentorAI** is a comprehensive **Learning Management System (LMS)** designed to manage educational content, training sessions, and user interactions. The project follows a **multi-tier architecture** with a **backend API** (ASP.NET Core), a **frontend web application** (Angular), and supporting infrastructure components.

---

## 🎯 Project Objectives

### Primary Goals:
1. **Manage Educational Training Programs** - Create, organize, and deliver training sessions and courses
2. **User Management** - Handle user authentication, roles, and session tracking
3. **Training Category Organization** - Organize training programs into logical categories
4. **Trainer/Formateur Management** - Manage instructors and their assigned courses
5. **User Session Tracking** - Track user enrollment and participation in training sessions
6. **API-Driven Architecture** - Provide REST APIs for seamless client-server communication

---

## 🏗️ Project Architecture

The project follows a **Clean Architecture** pattern with clear separation of concerns:

```
MentorAI Project (Manager.sln)
├── API/              (Backend - ASP.NET Core)
├── Client/           (Frontend - Angular)
├── Core/             (Business Logic & Entities)
└── Infrastructure/   (Data Access & Persistence)
```

---

## 📦 Directory Structure & Components

### 1. **API Layer** (`/API`)
**Responsibility:** Handle HTTP requests, route management, and API endpoints

| Folder | Purpose |
|--------|---------|
| `Controllers/` | API endpoint handlers for routes (training, sessions, users, etc.) |
| `Dtos/` | Data Transfer Objects for API request/response serialization |
| `Middleware/` | Custom middleware for request processing, error handling, logging |
| `Extensions/` | Extension methods for dependency injection and service configuration |
| `Helpers/` | Utility functions and helper classes for API operations |
| `Program.cs` | Application startup configuration, service registration, middleware setup |
| `appsettings.*.json` | Configuration files for different environments (Development, Production) |

**Key Technologies:**
- ASP.NET Core (.NET Framework)
- Entity Framework Core (ORM)
- Serilog (Structured Logging)
- Swagger/OpenAPI (API Documentation)
- MySQL (Database)

---

### 2. **Client Layer** (`/Client`)
**Responsibility:** Frontend web interface for user interaction

| Folder | Purpose |
|--------|---------|
| `src/` | Source code for Angular components, services, and views |
| `assets/` | Static resources (images, styles, etc.) |
| `.angular/` | Angular CLI cache and build artifacts |
| `angular.json` | Angular CLI configuration |
| `package.json` | Dependencies and scripts for Node.js/npm |
| `tsconfig.json` | TypeScript compiler configuration |

**Key Technologies:**
- Angular 18 (Frontend Framework)
- TypeScript (Language)
- RxJS (Reactive Programming)
- Simli Client (AI/Avatar integration)
- Anam AI SDK (Artificial Intelligence features)

**Features:**
- Study platform UI
- Interactive training interface
- Real-time user engagement features

---

### 3. **Core Layer** (`/Core`)
**Responsibility:** Business logic, domain models, and specifications

| Folder | Purpose |
|--------|---------|
| `Entities/` | Domain entities representing core business models |
| `Interfaces/` | Abstract interfaces for repositories and services |
| `Specifications/` | Query specifications for filtering and searching data |

**Domain Entities:**
- `ApplicationUser` - User profile and authentication data
- `Formation` - Training/Course information
- `Formateur` - Trainer/Instructor profile
- `Session` - Training session details
- `UserSession` - User enrollment in training sessions
- `Categorie` - Training category classification
- `BaseEntity` - Base class for all entities (contains common properties like ID, timestamps)

---

### 4. **Infrastructure Layer** (`/Infrastructure`)
**Responsibility:** Data persistence, database operations, and migrations

| Folder | Purpose |
|--------|---------|
| `Data/` | Database context (DbContext), connection configuration |
| `Migrations/` | Entity Framework Core migrations for database schema changes |
| `Scripts/` | Database scripts and seed data |

**Key Technologies:**
- Entity Framework Core (ORM for data access)
- MySQL (Database system)
- EF Core Migrations (Schema versioning)

**Database Context:**
- `AppDbContext` - Main database context managing all entities and relationships

---

## 🔄 Data Flow & Architecture Patterns

### Request-Response Flow:
```
Client (Angular)
    ↓
[API Controllers]
    ↓
[Business Logic / Services]
    ↓
[Core Domain Models]
    ↓
[Infrastructure / Data Access]
    ↓
[MySQL Database]
```

### Architecture Pattern:
- **Layered Architecture** - Clean separation between UI, Business Logic, and Data Access
- **Repository Pattern** - Data access abstraction
- **Specification Pattern** - Reusable query logic
- **Dependency Injection** - Loose coupling and testability

---

## 🛠️ Technology Stack

### Backend:
- **Language:** C# (.NET)
- **Framework:** ASP.NET Core
- **ORM:** Entity Framework Core
- **Database:** MySQL
- **Logging:** Serilog
- **API Documentation:** Swagger/OpenAPI
- **Authentication:** JWT/Identity Services

### Frontend:
- **Language:** TypeScript
- **Framework:** Angular 18
- **Package Manager:** npm
- **Styling:** Angular styles/CSS
- **AI Integration:** Simli Client, Anam AI SDK

### Project Management:
- **Build Tool:** .NET CLI
- **Solution File:** Manager.sln

---

## 📊 Key Features & Responsibilities

| Feature | Component | Purpose |
|---------|-----------|---------|
| User Authentication | API + Core | Secure user login and token management |
| Training Programs | Formation Entity | Define and manage courses/training |
| Trainers | Formateur Entity | Manage instructor information |
| Training Sessions | Session Entity | Schedule and organize training events |
| User Enrollment | UserSession Entity | Track user participation |
| Content Categories | Categorie Entity | Organize training by type |
| API Endpoints | Controllers | REST APIs for all operations |
| Database | Infrastructure | Persistent data storage |

---

## 🚀 Development Workflow

### Frontend Development:
```bash
cd Client
npm install          # Install dependencies
npm start           # Run development server (localhost:4200)
npm build           # Production build
npm test            # Run tests
```

### Backend Development:
```bash
cd API
dotnet build        # Build solution
dotnet run          # Run API (localhost:5000/5001)
dotnet test         # Run tests
```

---

## 📝 Configuration

- **API Configuration:** `API/appsettings.json`, `appsettings.Development.json`
- **Database Connection:** Configured in `Program.cs` using MySQL
- **Logging:** Configured via Serilog in `Program.cs`
- **CORS:** Configured for client-server communication
- **Authentication:** Identity services setup in extensions

---

## 🔐 Security Features

- **Authentication:** JWT tokens via Identity Services
- **Authorization:** Role-based access control
- **HTTPS:** Enabled in production
- **Exception Handling:** Global exception handler middleware
- **Status Code Pages:** Custom error pages for HTTP status codes

---

## 📈 Scalability & Extensibility

The project is designed for:
- **Easy Feature Addition** - Add new controllers/entities as needed
- **Database Scaling** - MySQL supports growth and performance tuning
- **API Versioning** - Support for multiple API versions
- **Frontend Modularity** - Angular components can be easily added/modified
- **Service Extension** - New business logic can be added to services

---

## 🎓 Learning Management Features

The system supports:
- Creating and managing training programs
- Assigning trainers to courses
- Organizing content by categories
- Tracking user enrollment and progress
- Managing training sessions and schedules
- User authentication and role management

---

## 📚 Related Files

- **Solution File:** `Manager.sln` - Contains all projects
- **Editor Config:** `.editorconfig` - Code style guidelines
- **Git Ignore:** `.gitignore` - Git exclusion rules
- **VSCode Config:** `.vscode/`, `.vscodecsdt` - Development environment setup

---

## 🔗 Dependencies & External Services

### Backend Dependencies:
- ASP.NET Core runtime
- Entity Framework Core
- Serilog
- MySQL driver

### Frontend Dependencies:
- Node.js / npm
- Angular CLI
- TypeScript compiler
- AI/Avatar libraries (Simli, Anam AI)

---

## ✅ Next Steps for Development

1. **Database Setup** - Run migrations to set up MySQL database
2. **API Testing** - Test all endpoints using Swagger UI
3. **Frontend Integration** - Connect Angular client to backend APIs
4. **Feature Development** - Build additional features as per requirements
5. **Testing** - Write unit and integration tests
6. **Deployment** - Deploy to production environment

---

**Created:** July 2026  
**Project Type:** Learning Management System (LMS)  
**Architecture:** Clean/Layered Architecture with Microservices-Ready Design
