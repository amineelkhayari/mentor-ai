# MentorAI Project - Design Patterns Analysis

## 📌 Overview

This document identifies and explains all **design patterns** implemented in the MentorAI Learning Management System. The project uses several **creational**, **structural**, and **behavioral** patterns to ensure maintainability, scalability, and clean code.

---

## 🏗️ Architectural Patterns

### 1. **Layered Architecture (N-Tier Architecture)**
**Location:** Project structure - API, Core, Infrastructure layers

**Description:**
- Organizes the application into horizontal layers, each with specific responsibilities
- Each layer is independent and communicates only with adjacent layers

**Layers:**
```
┌─────────────────────────────────────────────┐
│         Presentation Layer (API)            │
│    Controllers, DTOs, Middleware            │
├─────────────────────────────────────────────┤
│         Business Logic Layer (Core)         │
│    Entities, Interfaces, Specifications    │
├─────────────────────────────────────────────┤
│      Data Access Layer (Infrastructure)     │
│    DbContext, Repositories, Migrations     │
├─────────────────────────────────────────────┤
│         Database Layer (MySQL)              │
└─────────────────────────────────────────────┘
```

**Benefits:**
- ✅ Clear separation of concerns
- ✅ Easy to test each layer independently
- ✅ Easy to modify one layer without affecting others
- ✅ Better code organization and maintainability

**Files Involved:**
- `API/` - Presentation Layer
- `Core/` - Business Logic Layer
- `Infrastructure/` - Data Access Layer

---

### 2. **Clean Architecture**
**Location:** Project structure and code organization

**Description:**
- Emphasizes independence from frameworks, UI, and databases
- Core business logic is at the center, surrounded by adapters
- Dependencies point inward (toward the core)

**Implementation:**
```
Core (Entities, Interfaces)
    ↑
    ├── Infrastructure (DbContext, Repositories)
    ├── API (Controllers, DTOs)
    └── External Libraries (Entity Framework, Serilog)
```

**Key Principle:**
- Business rules don't depend on frameworks; frameworks depend on business rules

---

## 🎯 Behavioral Patterns

### 3. **Repository Pattern**
**Location:** `Core/Interfaces/IGenericRepository.cs`, `Infrastructure/Data/`

**Description:**
- Provides an abstraction for data access operations
- Creates a middle layer between business logic and database
- Encapsulates data retrieval logic

**Implementation:**
```csharp
public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<IReadOnlyList<T>> ListAllAsync();
    Task<T?> GetEntityAsync(ISpecification<T> spec);
    Task<IReadOnlyList<T>> GetEntitiesAsync(ISpecification<T> spec);
    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);
}
```

**Benefits:**
- ✅ Decouples business logic from data access
- ✅ Easy to swap database implementations
- ✅ Simplifies unit testing (can mock repositories)
- ✅ Centralized data access logic

**Usage:**
- Generic repository for all entities (Formation, Formateur, Session, UserSession, etc.)

---

### 4. **Unit of Work Pattern**
**Location:** `Core/Interfaces/IUnitOfWork.cs`

**Description:**
- Manages a collection of repositories as a single unit
- Coordinates changes across multiple repositories
- Ensures all-or-nothing transaction behavior

**Implementation:**
```csharp
public interface IUnitOfWork : IDisposable
{
    IGenericRepository<T> Repository<T>() where T : BaseEntity;
    Task<int> Complete();  // Commits all changes
}
```

**Workflow:**
```
1. Get Repository → 2. Perform Operations → 3. Call Complete() → 4. All changes committed
```

**Benefits:**
- ✅ Single point to manage transactions
- ✅ Ensures data consistency across multiple operations
- ✅ Simplifies commit/rollback logic
- ✅ Works seamlessly with Entity Framework Core

---

### 5. **Specification Pattern**
**Location:** `Core/Specifications/`

**Description:**
- Encapsulates complex query logic into reusable specifications
- Separates filtering, sorting, and pagination logic
- Creates a set of reusable query definitions

**Implementation:**
```csharp
// Repository method accepts specification
Task<T?> GetEntityAsync(ISpecification<T> spec);
Task<IReadOnlyList<T>> GetEntitiesAsync(ISpecification<T> spec);
Task<int> CountAsync(ISpecification<T> spec);
```

**Example Usage:**
```csharp
// Create a specification
var spec = new FormationWithCategorieSpec(categoryId);

// Use it in repository
var formations = await _unitOfWork.Repository<Formation>()
    .GetEntitiesAsync(spec);
```

**Benefits:**
- ✅ Reduces code duplication
- ✅ Makes queries testable and reusable
- ✅ Separates query logic from business logic
- ✅ Easier to maintain complex queries

---

## 🔧 Creational Patterns

### 6. **Dependency Injection (DI) Pattern**
**Location:** `API/Program.cs`, `API/Extensions/ApplicationServicesExtensions.cs`

**Description:**
- Provides dependencies to components rather than having them create dependencies
- Managed by .NET's built-in DI container

**Implementation:**
```csharp
// Service registration
services.AddScoped<IUnitOfWork, UnitOfWork>();
services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
services.AddScoped<ITokenService, TokenService>();

// DI in constructors
public class FormationsController : BaseApiController
{
    private readonly IUnitOfWork _unitOfWork;
    
    public FormationsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;  // Injected automatically
    }
}
```

**Lifetimes:**
- `Scoped` - One instance per HTTP request (most common for web apps)
- `Singleton` - Single instance for application lifetime
- `Transient` - New instance every time

**Benefits:**
- ✅ Loose coupling between classes
- ✅ Easy to test (can inject mocks)
- ✅ Centralized configuration management
- ✅ Makes code more flexible and maintainable

---

### 7. **Factory Pattern (Implicit)**
**Location:** `IUnitOfWork` interface

**Description:**
- `Repository<T>()` method acts as a factory
- Creates and returns appropriate repository instances for different entity types

**Implementation:**
```csharp
// Generic factory method
IGenericRepository<T> Repository<T>() where T : BaseEntity;

// Usage
var formationRepo = _unitOfWork.Repository<Formation>();
var sessionRepo = _unitOfWork.Repository<Session>();
```

**Benefits:**
- ✅ Abstraction of object creation
- ✅ Type-safe repository creation
- ✅ Reduces code repetition

---

## 🎨 Structural Patterns

### 8. **Data Transfer Object (DTO) Pattern**
**Location:** `API/Dtos/`

**Description:**
- Transfers data between different layers
- Separates API contracts from internal domain models
- Provides data validation and transformation

**Example:**
```csharp
// DTO for API responses
public class FormationDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}

// Entity class
public class Formation : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    // ... more properties
}
```

**Benefits:**
- ✅ Decouples API from database models
- ✅ Prevents exposing sensitive data
- ✅ Allows flexible API design
- ✅ Simplifies data serialization/deserialization

---

### 9. **Adapter Pattern (Implicit)**
**Location:** Entity Framework Core usage

**Description:**
- Entity Framework Core acts as an adapter between the application and database
- Abstracts database-specific details

**Implementation:**
- Database queries are translated to SQL automatically
- Application code remains database-agnostic

---

### 10. **Decorator Pattern (Implicit)**
**Location:** Extension methods in `API/Extensions/`

**Description:**
- Extends functionality without modifying core classes
- Uses C# extension methods to add behavior

**Example:**
```csharp
public static class StringExtensions
{
    public static string SomeMethod(this string value)
    {
        // Extended functionality
    }
}
```

**Benefits:**
- ✅ Adds functionality without modifying existing code
- ✅ Open/Closed Principle (Open for extension, closed for modification)

---

## 🔐 Security Patterns

### 11. **Template Method Pattern (Implicit)**
**Location:** `BaseApiController.cs`, `BaseEntity.cs`

**Description:**
- Base classes define the skeleton of operations
- Derived classes implement specific steps

**Implementation:**
```csharp
// Base controller provides common functionality
public class BaseApiController : ControllerBase
{
    // Common properties/methods for all controllers
}

// Specific controllers inherit and extend
public class FormationsController : BaseApiController
{
    // Specific implementation
}

// Base entity provides common structure
public class BaseEntity
{
    public int Id { get; set; }
    // Common properties
}
```

---

### 12. **Strategy Pattern (Implicit)**
**Location:** Authentication/Authorization strategy

**Description:**
- Different authentication strategies (JWT, Identity)
- Encapsulated in `ITokenService` interface

**Implementation:**
```csharp
public interface ITokenService
{
    string CreateToken(ApplicationUser user);
}

// Different implementations can be swapped
```

---

## 🧩 Integration Patterns

### 13. **Middleware Pattern**
**Location:** `API/Middleware/`

**Description:**
- Pipeline of handlers for HTTP requests
- Each middleware component processes request/response

**Implementation in Program.cs:**
```csharp
app.UseExceptionHandler();              // Exception handling
app.UseStatusCodePagesWithReExecute();  // Status code pages
app.UseHttpsRedirection();              // HTTPS redirect
app.UseCors();                          // CORS
app.UseAuthentication();                // Authentication
app.UseAuthorization();                 // Authorization
```

**Benefits:**
- ✅ Cross-cutting concerns
- ✅ Request/response pipeline management
- ✅ Separation of concerns

---

### 14. **Extension Method Pattern**
**Location:** `API/Extensions/`

**Description:**
- Extends built-in .NET classes without modification
- Organizes service registration logic

**Files:**
- `ApplicationServicesExtensions.cs` - Registers application services
- `IdentityServiceExtensions.cs` - Registers authentication services
- `SwaggerServiceExtensions.cs` - Registers API documentation
- `StringExtensions.cs` - String utility methods

**Benefits:**
- ✅ Cleaner Program.cs file
- ✅ Organized service registration
- ✅ Reusable across multiple projects

---

### 15. **Service Locator Pattern (Anti-pattern, but implicit in configuration)**
**Location:** `Program.cs` service registration

**Description:**
- Central registry of services
- Avoid this pattern in general, but useful for configuration

---

## 📊 Pattern Usage Summary

| Pattern | Type | Location | Purpose |
|---------|------|----------|---------|
| Layered Architecture | Architectural | Project Structure | Organize code into layers |
| Clean Architecture | Architectural | Overall Design | Decouple from frameworks |
| Repository | Behavioral | Core/Interfaces | Abstract data access |
| Unit of Work | Behavioral | Core/Interfaces | Manage transactions |
| Specification | Behavioral | Core/Specifications | Encapsulate queries |
| Dependency Injection | Creational | Program.cs | Inject dependencies |
| Factory | Creational | IUnitOfWork | Create repositories |
| Data Transfer Object | Structural | API/Dtos | Transfer data between layers |
| Adapter | Structural | Entity Framework | Abstract database |
| Decorator | Structural | Extensions | Add functionality |
| Template Method | Behavioral | BaseApiController | Define operation skeleton |
| Strategy | Behavioral | ITokenService | Implement strategies |
| Middleware | Integration | API/Middleware | Process HTTP requests |
| Extension Method | Structural | API/Extensions | Extend classes |

---

## 🎯 How Patterns Work Together

```
1. CLIENT REQUEST
    ↓
2. MIDDLEWARE (Pipeline of handlers)
    ↓
3. CONTROLLER (Base Controller Template Method)
    ↓
4. DEPENDENCY INJECTION (Injects dependencies)
    ↓
5. REPOSITORY PATTERN (Data access abstraction)
    ↓
6. SPECIFICATION PATTERN (Query encapsulation)
    ↓
7. UNIT OF WORK (Manage transactions)
    ↓
8. DATABASE ACCESS (Entity Framework Adapter)
    ↓
9. DTO PATTERN (Transform data)
    ↓
10. API RESPONSE
```

---

## ✅ Best Practices Implemented

| Practice | Benefit |
|----------|---------|
| Single Responsibility | Each layer/class has one reason to change |
| Open/Closed | Open for extension, closed for modification |
| Liskov Substitution | Derived classes can replace base classes |
| Interface Segregation | Many specific interfaces vs. one general-purpose |
| Dependency Inversion | Depend on abstractions, not concretions |

---

## 🚀 Advanced Pattern Combinations

### Authentication Flow:
```
User Login
    ↓
[AccountController] (Template Method)
    ↓
[ITokenService] (Dependency Injection + Strategy)
    ↓
[JWT Creation]
    ↓
[Token Response]
```

### Data Retrieval Flow:
```
GET Request
    ↓
[FormationsController] (Template Method + DI)
    ↓
[IUnitOfWork.Repository<Formation>()] (Factory + Repository)
    ↓
[ISpecification<Formation>] (Specification Pattern)
    ↓
[Entity Framework] (Adapter Pattern)
    ↓
[MySQL Database]
    ↓
[FormationDto] (DTO Pattern)
    ↓
[JSON Response]
```

---

## 💡 Why These Patterns?

1. **Maintainability** - Easy to understand and modify code
2. **Testability** - Easy to unit test with mocks and stubs
3. **Scalability** - Easy to add new features without breaking existing code
4. **Flexibility** - Easy to swap implementations (e.g., MySQL → PostgreSQL)
5. **Code Reuse** - Generic patterns reduce code duplication
6. **SOLID Principles** - Follows industry best practices

---

## 🔄 Pattern Relationships

```
┌─────────────────────────────────────────────────────────┐
│ DEPENDENCY INJECTION manages all dependencies           │
├─────────────────────────────────────────────────────────┤
│  REPOSITORY ← provides data access                      │
│  UNIT OF WORK ← orchestrates operations                 │
│  SPECIFICATION ← encapsulates queries                   │
│  DTO PATTERN ← transforms data                          │
└─────────────────────────────────────────────────────────┘
         ↑              ↑              ↑
         │              │              │
    MIDDLEWARE    TEMPLATE METHOD    FACTORY
```

---

**Summary:** The MentorAI project implements **15+ design patterns** working together to create a robust, maintainable, and scalable Learning Management System. These patterns ensure the codebase follows SOLID principles and industry best practices.

**Last Updated:** July 2026
