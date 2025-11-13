# Database Schema Documentation

## Overview

This document describes the database schema for the SecureTaskMgmt application. The schema supports multi-user task management with role-based access control, organizational hierarchy, and comprehensive audit logging.

## Technology

- **ORM**: TypeORM
- **Database**: SQLite (better-sqlite3) for development
- **Migration Support**: Ready for PostgreSQL in production
- **Auto-sync**: Enabled in development mode only

## Entity Relationship Diagram

```
┌──────────────┐         ┌─────────────────────┐         ┌──────────────────┐
│     User     │◄───────►│ UserOrganization    │◄───────►│  Organization    │
│              │  1   *  │                     │  *   1  │                  │
├──────────────┤         ├─────────────────────┤         ├──────────────────┤
│ id (PK)      │         │ id (PK)             │         │ id (PK)          │
│ email        │         │ userId (FK)         │         │ name             │
│ passwordHash │         │ organizationId (FK) │         │ description      │
│ firstName    │         │ role (enum)         │         │ createdAt        │
│ lastName     │         │ joinedAt            │         │ updatedAt        │
│ isActive     │         └─────────────────────┘         └──────────────────┘
│ createdAt    │                                                  │
│ updatedAt    │                                                  │ 1
└──────────────┘                                                  │
       │ 1                                                        │
       │                                                          │
       │                                                          │
       │ *                                                        │ *
┌──────────────┐         ┌─────────────────────┐         ┌──────────────────┐
│     Task     │◄───────►│  TaskAssignment     │         │   AuditLog       │
│              │  1   *  │                     │         │                  │
├──────────────┤         ├─────────────────────┤         ├──────────────────┤
│ id (PK)      │         │ id (PK)             │         │ id (PK)          │
│ title        │         │ taskId (FK)         │         │ userId (FK)      │
│ description  │         │ userId (FK)         │         │ action (enum)    │
│ status       │         │ assignedAt          │         │ entityType       │
│ priority     │         └─────────────────────┘         │ entityId         │
│ dueDate      │                                         │ ipAddress        │
│ creatorId    │◄────────────────────────────────────────┤ metadata (JSON)  │
│ organizationId│                                        │ createdAt        │
│ createdAt    │                                         └──────────────────┘
│ updatedAt    │
│ deletedAt    │
└──────────────┘
```

## Entities

### 1. User (`users`)

Stores user account information.

**Columns:**
- `id` (UUID, PK): Unique user identifier
- `email` (string, unique): User email address
- `passwordHash` (string, select: false): Hashed password
- `firstName` (string): User's first name
- `lastName` (string): User's last name
- `isActive` (boolean, default: true): Account status
- `createdAt` (timestamp): Account creation date
- `updatedAt` (timestamp): Last update timestamp

**Relationships:**
- One-to-Many with `UserOrganization`
- One-to-Many with `Task` (as creator)
- One-to-Many with `TaskAssignment`
- One-to-Many with `AuditLog`

**Security Features:**
- Password hash excluded from SELECT queries by default
- Soft delete capability through related entities

---

### 2. Organization (`organizations`)

Represents organizational units (companies, teams, departments).

**Columns:**
- `id` (UUID, PK): Unique organization identifier
- `name` (string): Organization name
- `description` (text, nullable): Organization description
- `createdAt` (timestamp): Creation date
- `updatedAt` (timestamp): Last update timestamp

**Relationships:**
- One-to-Many with `UserOrganization`
- One-to-Many with `Task`

**Features:**
- Hierarchical organization support
- Users can belong to multiple organizations

---

### 3. UserOrganization (`user_organizations`)

Join table managing many-to-many relationship between Users and Organizations with role assignments.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `userId` (UUID, FK): Reference to User
- `organizationId` (UUID, FK): Reference to Organization
- `role` (enum): User's role in the organization
- `joinedAt` (timestamp): When user joined organization

**Role Enum Values:**
- `super_admin`: System-wide administration
- `org_admin`: Organization administration
- `manager`: Team/project management
- `user`: Standard user access
- `viewer`: Read-only access

**Relationships:**
- Many-to-One with `User` (CASCADE delete)
- Many-to-One with `Organization` (CASCADE delete)

**Business Rules:**
- A user can have different roles in different organizations
- Deleting a user or organization removes all associations

---

### 4. Task (`tasks`)

Core task management entity.

**Columns:**
- `id` (UUID, PK): Unique task identifier
- `title` (string): Task title
- `description` (text, nullable): Detailed description
- `status` (enum, default: 'todo'): Current task status
- `priority` (enum, default: 'medium'): Task priority level
- `dueDate` (date, nullable): Task deadline
- `creatorId` (UUID, FK): User who created the task
- `organizationId` (UUID, FK): Owning organization
- `createdAt` (timestamp): Creation date
- `updatedAt` (timestamp): Last modification date
- `deletedAt` (timestamp, nullable): Soft delete timestamp

**Status Enum Values:**
- `todo`: Not started
- `in_progress`: Currently being worked on
- `done`: Completed
- `archived`: Archived/inactive

**Priority Enum Values:**
- `low`: Low priority
- `medium`: Medium priority
- `high`: High priority
- `urgent`: Urgent/critical

**Relationships:**
- Many-to-One with `User` (creator, CASCADE delete)
- Many-to-One with `Organization` (CASCADE delete)
- One-to-Many with `TaskAssignment`

**Features:**
- Soft delete support (deletedAt timestamp)
- Automatic timestamp tracking
- Multi-user assignment capability

---

### 5. TaskAssignment (`task_assignments`)

Tracks user assignments to tasks (many-to-many).

**Columns:**
- `id` (UUID, PK): Unique identifier
- `taskId` (UUID, FK): Reference to Task
- `userId` (UUID, FK): Reference to assigned User
- `assignedAt` (timestamp): Assignment timestamp

**Relationships:**
- Many-to-One with `Task` (CASCADE delete)
- Many-to-One with `User` (CASCADE delete)

**Business Rules:**
- A task can be assigned to multiple users
- A user can have multiple task assignments
- Assignments are automatically removed when task or user is deleted

---

### 6. AuditLog (`audit_logs`)

Comprehensive audit trail for security and compliance.

**Columns:**
- `id` (UUID, PK): Unique log entry identifier
- `userId` (UUID, FK, nullable): User who performed action
- `action` (enum): Type of action performed
- `entityType` (string): Type of entity affected
- `entityId` (UUID, nullable): Affected entity identifier
- `ipAddress` (string, nullable): User's IP address
- `metadata` (JSON, nullable): Additional context data
- `createdAt` (timestamp): When action occurred

**Action Enum Values:**

*Authentication:*
- `login`, `logout`, `login_failed`, `password_reset`

*User Management:*
- `user_created`, `user_updated`, `user_deleted`

*Task Operations:*
- `task_created`, `task_updated`, `task_deleted`
- `task_assigned`, `task_unassigned`

*Organization Operations:*
- `org_created`, `org_updated`, `org_deleted`
- `org_user_added`, `org_user_removed`

*Security:*
- `role_changed`, `data_exported`

**Relationships:**
- Many-to-One with `User` (SET NULL on delete)

**Features:**
- System actions can have null userId
- JSON metadata for flexible context storage
- IP address tracking for security
- Immutable records (no updates/deletes)

---

## Indexes

TypeORM will automatically create indexes for:
- Primary keys (all entities)
- Foreign keys (all relationships)
- Unique constraints (User.email)

**Recommended Additional Indexes** (to be added via migrations):
```sql
CREATE INDEX idx_tasks_organization ON tasks(organizationId);
CREATE INDEX idx_tasks_creator ON tasks(creatorId);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_audit_logs_user ON audit_logs(userId);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(createdAt);
```

---

## Data Integrity Rules

### Cascade Behaviors

**ON DELETE CASCADE:**
- User deleted → Remove all UserOrganizations, Tasks, TaskAssignments
- Organization deleted → Remove all UserOrganizations, Tasks
- Task deleted → Remove all TaskAssignments

**ON DELETE SET NULL:**
- User deleted → AuditLogs.userId set to null (preserve audit trail)

### Soft Deletes

Tasks support soft deletion via `deletedAt` timestamp:
- Deleted tasks remain in database
- TypeORM automatically excludes soft-deleted records
- Can be recovered or permanently deleted later

---

## Migration Strategy

### Development
- `synchronize: true` - Auto-sync schema
- `logging: true` - SQL query logging

### Production
- `synchronize: false` - Use migrations only
- Generate migrations: `npm run migration:generate -- -n MigrationName`
- Run migrations: `npm run migration:run`

---

## Security Considerations

1. **Password Storage**: Hashed using bcrypt (implemented in auth service)
2. **Audit Trail**: All critical operations logged with IP tracking
3. **Soft Deletes**: Tasks can be recovered if deleted accidentally
4. **Role-Based Access**: Enforced at application layer
5. **Data Isolation**: Organization-scoped queries prevent data leakage

---

## Sample Queries

### Get User's Organizations with Roles
```typescript
const userOrgs = await userOrganizationRepository.find({
  where: { userId },
  relations: ['organization'],
});
```

### Get Tasks Assigned to User
```typescript
const tasks = await taskRepository
  .createQueryBuilder('task')
  .leftJoinAndSelect('task.assignments', 'assignment')
  .where('assignment.userId = :userId', { userId })
  .andWhere('task.status != :status', { status: TaskStatus.ARCHIVED })
  .getMany();
```

### Audit Trail for Entity
```typescript
const logs = await auditLogRepository.find({
  where: { entityType: 'Task', entityId: taskId },
  relations: ['user'],
  order: { createdAt: 'DESC' },
});
```

---

## File Locations

- **Entities**: `src/entities/*.entity.ts`
- **Enums**: `src/common/enums/*.enum.ts`
- **Config**: `src/config/database.config.ts`

---

## Next Steps

1. Implement repository pattern for each entity
2. Create DTOs (Data Transfer Objects) for validation
3. Build services with business logic
4. Add database seeding for development
5. Create migration files for production deployment
