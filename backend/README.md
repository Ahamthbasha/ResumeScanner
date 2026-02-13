# Resume Scanner - Backend

Backend API for the Resume Scanner application built with Node.js, Express, and TypeScript.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Database configuration
│   │   └── constants.ts # Application constants
│   ├── controllers/     # Business logic layer
│   │   └── ResumeController.ts
│   ├── middleware/      # Express middleware
│   │   ├── upload.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── models/          # Data models
│   │   └── Resume.ts
│   ├── routes/          # API routes
│   │   └── resumeRoutes.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── logger.ts
│   │   └── fileUtils.ts
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript
├── package.json         # NPM dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── .env.example         # Environment variables example
└── .gitignore
```

## MVC Architecture Overview

### Models (`src/models/`)

- Define data structures and database operations
- Handle data persistence and retrieval
- Example: `ResumeModel.ts` - manages resume data

### Controllers (`src/controllers/`)

- Contain business logic for handling requests
- Orchestrate model and route operations
- Example: `ResumeController.ts` - handles resume operations

### Routes (`src/routes/`)

- Define API endpoints and their HTTP methods
- Connect controllers to specific routes
- Example: `resumeRoutes.ts` - resume API endpoints

### Middleware (`src/middleware/`)

- Handle cross-cutting concerns (auth, validation, error handling)
- Process requests before they reach controllers
- Examples: `upload.ts`, `validation.ts`, `errorHandler.ts`

### Configuration (`src/config/`)

- Store application configuration
- Database settings
- Constants and environment variables

### Types (`src/types/`)

- TypeScript interfaces and type definitions
- Ensure type safety across the application

### Utils (`src/utils/`)

- Helper functions and utilities
- Logger, file operations, etc.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This command starts the development server with auto-reload using `ts-node-dev`.

## Build

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

## Production

```bash
npm run build
npm start
```

## API Endpoints

### Resume Management

- `POST /api/v1/resumes/upload` - Upload a new resume
- `GET /api/v1/resumes` - Get all resumes
- `GET /api/v1/resumes/:id` - Get a specific resume
- `DELETE /api/v1/resumes/:id` - Delete a resume

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

## TypeScript Features Used

- ✅ Strict mode enabled for type safety
- ✅ Decorators and metadata (experimentalDecorators)
- ✅ Source maps for debugging
- ✅ Type checking for no unused variables/parameters
- ✅ Interfaces for api responses and data models

## Next Steps

1. Set up your database (PostgreSQL, MongoDB, etc.)
2. Update `src/config/database.ts` with your database configuration
3. Implement actual database models replacing the mock in `ResumeModel.ts`
4. Add authentication middleware (JWT, OAuth, etc.)
5. Implement resume parsing logic
6. Add unit tests and integration tests

## Contributing

[Add your contributing guidelines here]

## License

MIT
