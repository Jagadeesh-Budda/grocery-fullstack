# Frontend Testing and Build

This document describes how to run, build, and test the frontend application.

## `package.json` scripts

The frontend uses Vite for development and Vitest for tests.

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "start": "vite",
  "test": "vitest"
}
```

Why it matters:
- `dev` starts the live development server with HMR,
- `build` creates optimized production bundles,
- `preview` lets you inspect the built app locally,
- `test` runs unit tests.

## Testing setup

### `vitest`

Vitest is the test runner used for component and logic tests.
It is configured through the frontend project dependencies.

### `src/setupTests.js`

This file is intended to configure the test environment and add utilities for React testing.

Why it matters:
- test setup ensures consistent behavior across test files,
- it can register global mocks and custom matchers.

## Build tooling

### `Vite`

Vite provides fast builds and development tooling.
The project uses the React plugin and proxy configuration for backend API access.

Why it matters:
- fast startup and reload during development,
- production bundles are optimized automatically,
- proxying backend calls avoids CORS issues during local development.

### `Tailwind CSS` + `PostCSS`

The build pipeline compiles Tailwind classes and autoprefixes CSS.

Why it matters:
- Tailwind utilities are transformed into production-ready CSS,
- autoprefixer ensures cross-browser compatibility.

## Why testing/build docs matter

- they help new developers run the project locally,
- they explain how to verify UI and logic changes,
- they document the tools powering the frontend development workflow.
