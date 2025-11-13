# SecureTaskMgmt - Secure Multi-Tenant Task Management System

A full-stack application featuring role-based access control, multi-organization support, and comprehensive audit logging.

## 📋 Project Overview

**Backend**: NestJS + TypeORM + SQLite
**Frontend**: Angular + TailwindCSS *(Coming Soon)*

## ✨ Features

### Backend (Implemented)
- ✅ JWT-based authentication with bcrypt password hashing
- ✅ Role-Based Access Control (RBAC) with 5-tier system
- ✅ Multi-tenant organization management
- ✅ Full CRUD operations for tasks
- ✅ Task assignment and collaboration
- ✅ Comprehensive audit logging
- ✅ Input validation with class-validator
- ✅ Database seeding for development

### Security Features
- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Role-based authorization guards
- CORS protection
- Input validation and sanitization
- Audit trail for all critical operations

## 🗂️ Project Structure

```
SecureTaskMgmt/
├── BackEnd/                    # NestJS backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   │   ├── dto/           # Login & Register DTOs
│   │   │   ├── guards/        # JWT & Role guards
│   │   │   ├── strategies/    # JWT strategy
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── users/             # User management
│   │   │   ├── dto/
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── organizations/     # Organization management
│   │   │   ├── dto/
│   │   │   ├── organizations.service.ts
│   │   │   └── organizations.module.ts
│   │   ├── tasks/             # Task management
│   │   │   ├── dto/
│   │   │   ├── tasks.service.ts
│   │   │   └── tasks.module.ts
│   │   ├── audit/             # Audit logging
│   │   │   ├── audit.service.ts
│   │   │   └── audit.module.ts
│   │   ├── entities/          # TypeORM entities
│   │   │   ├── user.entity.ts
│   │   │   ├── organization.entity.ts
│   │   │   ├── user-organization.entity.ts
│   │   │   ├── task.entity.ts
│   │   │   ├── task-assignment.entity.ts
│   │   │   └── audit-log.entity.ts
│   │   ├── common/
│   │   │   ├── enums/         # Role, Status, Priority enums
│   │   │   ├── decorators/    # Custom decorators
│   │   │   └── utils/         # Bcrypt utility
│   │   ├── config/            # Database configuration
│   │   ├── database/
│   │   │   └── seeding/       # Database seeding
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment template
│   ├── DATABASE.md            # Database schema docs
│   └── SETUP.md               # Setup instructions
├── FrontEnd/                  # Angular frontend (TBD)
├── claude.md                  # Project planning document
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ (v20.13.1 recommended)
- npm v9+

### Backend Setup

1. **Navigate to BackEnd directory**:
```bash
cd BackEnd
```

2. **Install dependencies**:
```bash
# On Windows with multiple Node versions
PATH="/c/Program Files/nodejs:$PATH" npm install

# Or use npm directly if Node 18+ is in PATH
npm install
```

3. **Configure environment**:
```bash
cp .env.example .env
# Edit .env and update JWT_SECRET values
```

4. **Build the project**:
```bash
PATH="/c/Program Files/nodejs:$PATH" npm run build
```

5. **Seed the database**:
```bash
PATH="/c/Program Files/nodejs:$PATH" npm run seed
```

6. **Start development server**:
```bash
PATH="/c/Program Files/nodejs:$PATH" npm run start:dev
```

The API will be available at `http://localhost:3000`

## 👥 Test Accounts

After running the seed command, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@example.com | password123 |
| Manager | manager@example.com | password123 |
| User | john.doe@example.com | password123 |
| User | jane.smith@example.com | password123 |

## 🔐 Role Hierarchy

1. **Super Admin** - System-wide administration
2. **Org Admin** - Organization administration
3. **Manager** - Create/assign tasks, view team tasks
4. **User** - Manage own tasks, view assigned tasks
5. **Viewer** - Read-only access

## 📊 Database Schema

### Entities

- **Users**: User accounts with authentication
- **Organizations**: Multi-tenant organizations
- **UserOrganization**: User-to-org mapping with roles
- **Tasks**: Task items with status/priority
- **TaskAssignments**: Task-to-user assignments
- **AuditLogs**: Complete audit trail

See `BackEnd/DATABASE.md` for detailed schema documentation.

## 🛠️ Available Scripts

### Backend
```bash
npm run build          # Build the application
npm run start          # Start production server
npm run start:dev      # Start development server with watch
npm run start:debug    # Start in debug mode
npm run seed           # Seed database with test data
npm run lint           # Run ESLint
npm run test           # Run unit tests
npm run test:e2e       # Run E2E tests
```

## 📡 API Endpoints

### Health Check
- `GET /` - Health check (public)
- `GET /health` - Health check (public)

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user (protected)

### Users
- `GET /users` - List all users (Admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Organizations
- `GET /organizations` - List organizations
- `POST /organizations` - Create organization
- `GET /organizations/:id` - Get organization
- `PUT /organizations/:id` - Update organization
- `DELETE /organizations/:id` - Delete organization
- `POST /organizations/:id/users` - Add user to organization
- `DELETE /organizations/:id/users/:userId` - Remove user from organization

### Tasks
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get task details
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task (soft delete)
- `POST /tasks/:id/assign` - Assign task to user
- `DELETE /tasks/:id/assign/:userId` - Unassign task
- `GET /tasks/my-tasks` - Get user's tasks

### Audit Logs
- `GET /audit-logs` - List audit logs (Admin only)
- `GET /audit-logs/user/:userId` - Get logs for user
- `GET /audit-logs/entity/:type/:id` - Get logs for entity

## 🔧 Configuration

### Environment Variables

See `.env.example` for all configuration options:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_TYPE=better-sqlite3
DB_DATABASE=database.sqlite

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=http://localhost:4200
```

## 📚 Technical Stack

### Backend
- **Framework**: NestJS 11.x
- **Database ORM**: TypeORM 0.3.x
- **Database**: SQLite 3 (better-sqlite3)
- **Authentication**: Passport + JWT
- **Validation**: class-validator + class-transformer
- **Password Hashing**: bcrypt
- **Language**: TypeScript 5.x

## 🏗️ Architecture Decisions

### State Management (Frontend - TBD)
**Chosen Approach**: Angular Signals with service-based state management

**Reasoning**:
- Native Angular solution (Angular 16+)
- Better performance than traditional RxJS
- Simpler than NgRx with less boilerplate
- Reactive and easy to test
- Future-proof with Angular's direction

## 🔒 Security Considerations

- All passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with configurable expiration
- Protected routes with JWT authentication guard
- Role-based authorization on endpoints
- Input validation on all DTOs
- SQL injection prevention via TypeORM
- CORS enabled with configurable origins
- Audit logging for all critical operations

## 📝 Development Notes

### Node.js Version Issues
If you have multiple Node.js versions (e.g., Emscripten SDK with Node v14), prepend commands with:
```bash
PATH="/c/Program Files/nodejs:$PATH" npm [command]
```

### Database
- SQLite used for development
- Schema auto-syncs in development mode
- Ready for PostgreSQL migration in production
- Soft deletes implemented for tasks

## 🚧 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Database schema
- [x] Authentication system
- [x] User management

### Phase 2: Core Features ✅
- [x] Organization hierarchy
- [x] Task CRUD operations
- [x] Role-based access control
- [x] Task assignment system
- [x] Audit logging

### Phase 3: Frontend (In Progress)
- [ ] Angular setup with TailwindCSS
- [ ] Authentication UI
- [ ] Task management interface
- [ ] Organization management
- [ ] Responsive design

### Phase 4: Enhancements
- [ ] Real-time notifications
- [ ] File attachments
- [ ] Task comments
- [ ] Advanced filtering/search
- [ ] Dashboard analytics
- [ ] Email notifications

## 📄 License

UNLICENSED - Private Project

## 👨‍💻 Author

Generated with Claude Code

---

**Note**: This project is a demonstration of secure multi-tenant task management with comprehensive RBAC and audit logging. Not intended for production use without further security hardening and testing.
