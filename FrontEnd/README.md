# SecureTaskMgmt - Frontend

Angular 18 + TailwindCSS frontend for the SecureTaskMgmt application.

## Features

### Implemented ✅

- **Authentication System**
  - Login page with form validation
  - Registration page with password confirmation
  - JWT token management
  - Auth guard for protected routes
  - HTTP interceptor for automatic token injection

- **State Management**
  - Angular Signals for reactive state
  - Service-based state management pattern
  - Minimal boilerplate, modern approach

- **Task Management**
  - Task list view with status indicators
  - Task creation form
  - Task editing functionality
  - Status and priority badges with colors
  - Soft delete support

- **Dashboard**
  - Task statistics (Todo, In Progress, Done)
  - Recent tasks overview
  - Quick navigation to tasks

- **Navigation**
  - Responsive navbar with mobile menu
  - Protected routes with auth guard
  - User profile display
  - Logout functionality

- **Responsive Design**
  - TailwindCSS utility-first styling
  - Mobile-first approach
  - Responsive breakpoints (sm, md, lg, xl)
  - Touch-friendly interface

## Tech Stack

- **Framework**: Angular 18
- **Styling**: TailwindCSS 3.x
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router with lazy loading
- **Forms**: Reactive Forms
- **Build Tool**: Angular CLI with esbuild

## Project Structure

```
FrontEnd/
├── src/
│   ├── app/
│   │   ├── core/                  # Core functionality
│   │   │   ├── guards/            # Route guards
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/      # HTTP interceptors
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── models/            # TypeScript interfaces
│   │   │   │   ├── user.model.ts
│   │   │   │   └── task.model.ts
│   │   │   └── services/          # Core services
│   │   │       ├── auth.service.ts
│   │   │       └── task.service.ts
│   │   ├── features/              # Feature modules
│   │   │   ├── auth/              # Authentication
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/         # Dashboard
│   │   │   └── tasks/             # Task management
│   │   │       ├── task-list/
│   │   │       └── task-form/
│   │   ├── shared/                # Shared components
│   │   │   └── components/
│   │   │       ├── navbar/
│   │   │       └── loading/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/              # Environment configs
│   └── styles.css                 # Global styles
└── tailwind.config.js             # TailwindCSS config
```

## Quick Start

### Prerequisites
- Node.js v20.13.1 or higher
- npm v9+

### Installation

```bash
# Navigate to FrontEnd directory
cd FrontEnd

# Install dependencies (on Windows with multiple Node versions)
PATH="/c/Program Files/nodejs:$PATH" npm install

# Or use npm directly if Node 18+ is in PATH
npm install
```

### Development Server

```bash
# Start dev server
PATH="/c/Program Files/nodejs:$PATH" npm start

# Or
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

### Build

```bash
# Production build
PATH="/c/Program Files/nodejs:$PATH" npm run build

# Or
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## API Integration

The frontend is configured to connect to the backend API at `http://localhost:3000`. Update this in `src/environments/environment.ts` if needed.

### Environment Configuration

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com'  // Update this
};
```

## Key Features Details

### Authentication Flow

1. User logs in via `/auth/login`
2. JWT token stored in localStorage
3. Token automatically attached to all HTTP requests via interceptor
4. Protected routes check authentication via authGuard
5. User redirected to login if not authenticated

### State Management with Signals

Angular Signals provide reactive state management:

```typescript
// In service
private tasksSignal = signal<Task[]>([]);
tasks = this.tasksSignal.asReadonly();

// In component
tasks = this.taskService.tasks;

// In template
@for (task of tasks(); track task.id) {
  // Render task
}
```

### Routing Structure

```
/                        → Redirect to /dashboard
/auth/login              → Login page (public)
/auth/register           → Registration page (public)
/dashboard               → Dashboard (protected)
/tasks                   → Task list (protected)
/tasks/new               → Create task (protected)
/tasks/:id               → Edit task (protected)
```

## Component Overview

### Core Services

**AuthService** (`core/services/auth.service.ts`)
- User authentication (login, register, logout)
- JWT token management
- Current user state with Signals
- Profile fetching

**TaskService** (`core/services/task.service.ts`)
- Task CRUD operations
- Task filtering
- Task assignment
- Reactive task state with Signals

### Guards

**authGuard** (`core/guards/auth.guard.ts`)
- Protects routes requiring authentication
- Redirects to login with return URL
- Functional guard (Angular's modern approach)

### Interceptors

**authInterceptor** (`core/interceptors/auth.interceptor.ts`)
- Automatically adds JWT token to HTTP requests
- Functional interceptor (Angular's modern approach)

## Styling with TailwindCSS

### Utility Classes

The project uses TailwindCSS utility classes for styling:

```html
<!-- Example: Button -->
<button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
  Submit
</button>

<!-- Example: Responsive layout -->
<div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
  <!-- Content -->
</div>
```

### Color Palette

- **Primary**: Indigo (indigo-600, indigo-700)
- **Success**: Green (green-600, green-100)
- **Warning**: Yellow (yellow-100, yellow-800)
- **Error**: Red (red-600, red-100)
- **Info**: Blue (blue-600, blue-100)

## Available Scripts

```bash
npm start          # Start dev server (port 4200)
npm run build      # Production build
npm test           # Run unit tests
npm run lint       # Run ESLint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Features

- XSS prevention via Angular's sanitization
- CSRF protection ready
- Secure token storage (localStorage)
- Input validation on all forms
- Auth guard protection
- HTTP-only approach ready (can be switched to cookies)

## Future Enhancements

- [ ] Organization management UI
- [ ] User management interface
- [ ] Task assignment UI
- [ ] Audit log viewer
- [ ] Real-time notifications
- [ ] Task comments
- [ ] File attachments
- [ ] Advanced filtering and search
- [ ] Dashboard analytics charts
- [ ] Email notifications
- [ ] Dark mode toggle

## Notes

- Uses standalone components (Angular's modern approach)
- Lazy-loaded routes for better performance
- Reactive Forms for all user inputs
- Signal-based state management (no NgRx needed)
- Fully typed with TypeScript

## Troubleshooting

### Node Version Issues

If you see Node version warnings, ensure you're using Node v20.13.1+:

```bash
node --version
# Should show v20.13.1 or higher
```

### Build Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

Change the port in `angular.json`:

```json
"serve": {
  "options": {
    "port": 4201
  }
}
```

---

Built with Angular 18 + TailwindCSS
