# Health Check Endpoint

## Overview

The root endpoint (`/`) and `/health` endpoint now return a comprehensive health check instead of "Hello World".

## Endpoints

Both endpoints are **public** (no authentication required):

- `GET /` - Root endpoint
- `GET /health` - Health check endpoint

## Response Format

```json
{
  "status": "healthy",
  "timestamp": "2025-11-13T12:34:56.789Z",
  "uptime": {
    "seconds": 3725,
    "formatted": "1h 2m 5s"
  },
  "environment": "development",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "type": "better-sqlite3"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Overall service status (`healthy`) |
| `timestamp` | string | Current server time (ISO 8601) |
| `uptime.seconds` | number | Uptime in seconds since app started |
| `uptime.formatted` | string | Human-readable uptime (e.g., "2d 5h 30m 15s") |
| `environment` | string | Current environment (development/production) |
| `version` | string | Application version |
| `database.status` | string | Database connection status (`connected`, `disconnected`, `error`) |
| `database.type` | string | Database type (e.g., `better-sqlite3`, `postgres`) |

## Database Status Values

- **`connected`**: Database is reachable and responding
- **`disconnected`**: Database connection not established
- **`error`**: Database query failed

## Testing

### Using cURL

```bash
# Test root endpoint
curl http://localhost:3000/

# Test health endpoint
curl http://localhost:3000/health
```

### Using Browser

Simply navigate to:
- http://localhost:3000/
- http://localhost:3000/health

### Expected Response Example

```json
{
  "status": "healthy",
  "timestamp": "2025-11-13T22:45:30.123Z",
  "uptime": {
    "seconds": 125,
    "formatted": "2m 5s"
  },
  "environment": "development",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "type": "better-sqlite3"
  }
}
```

## Use Cases

1. **Load Balancer Health Checks**: Use this endpoint for health probing
2. **Monitoring**: Track service availability and uptime
3. **Debugging**: Verify database connectivity
4. **CI/CD**: Ensure service is ready before routing traffic

## Implementation Details

- Health check runs a simple `SELECT 1` query to verify database connectivity
- Uptime is calculated from application start time
- Endpoint is marked as `@Public()` so it doesn't require JWT authentication
- Database query errors are caught and reported as `error` status

## Notes

- The endpoint always returns HTTP 200, even if database is disconnected
- For production use, consider returning appropriate HTTP status codes based on health
- Uptime resets when the application restarts
- Database type is automatically detected from TypeORM configuration
