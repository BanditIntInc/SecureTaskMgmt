# Backend Setup Guide

## Prerequisites

- Node.js v18+ (v20.13.1 recommended)
- npm v9+

## Important Note About Node.js Version

This project requires Node.js v18 or higher. If you have multiple Node.js versions installed (e.g., Emscripten SDK with older Node), you need to ensure the correct version is used.

### Check Your Node Version
```bash
node --version
```

### If Using Older Node (v14 from Emscripten)
Prepend commands with the correct Node.js path:

```bash
# Windows
PATH="/c/Program Files/nodejs:$PATH" npm install
PATH="/c/Program Files/nodejs:$PATH" npm run start

# Alternative: Use full path
"/c/Program Files/nodejs/npm.cmd" install
"/c/Program Files/nodejs/npm.cmd" run start
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration (especially JWT secrets in production)

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## Project Structure

```
BackEnd/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/                # E2E tests
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
└── database.sqlite      # SQLite database (not in git)
```

## Technology Stack

- **Framework**: NestJS
- **Database ORM**: TypeORM
- **Database**: SQLite (better-sqlite3)
- **Configuration**: @nestjs/config
- **Language**: TypeScript

## Database Configuration

The application uses SQLite by default for development. TypeORM is configured to:
- Auto-synchronize schema in development mode
- Enable logging in development mode
- Store entities using the `*.entity.ts` pattern

Database file location: `database.sqlite` (created automatically on first run)

## Environment Variables

See `.env.example` for all available configuration options:

- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Application port (default: 3000)
- `DB_TYPE`: Database type (better-sqlite3)
- `DB_DATABASE`: Database file path
- `JWT_SECRET`: Secret for JWT token signing
- `JWT_EXPIRES_IN`: JWT token expiration
- `CORS_ORIGIN`: Allowed CORS origin

## Next Steps

1. Generate authentication module: `nest g module auth`
2. Generate users module: `nest g module users`
3. Generate tasks module: `nest g module tasks`
4. Generate organizations module: `nest g module organizations`
5. Create entity files for each module
6. Implement services and controllers

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Troubleshooting

### Node Version Issues
If you see "Unexpected token '??='" errors, your Node.js version is too old. Upgrade to v18+.

### Port Already in Use
Change the `PORT` in `.env` file to an available port.

### Database Locked
If you get database locked errors, ensure no other process is accessing the SQLite file.
