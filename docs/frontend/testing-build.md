# Frontend Testing and Build

This section explains how frontend testing and build tooling are configured.

## `package.json` scripts

- `npm run dev` / `npm start`: starts the Vite development server.
- `npm run build`: creates a production-ready build.
- `npm run preview`: serves the built application locally.
- `npm run test`: runs frontend tests with Vitest.

## Testing setup

### `src/setupTests.js`
- Used to configure the testing environment.
- Useful for setting up test utilities and mocking APIs.

### Vitest
- A fast test runner and assertion library for Vite projects.
- Useful for unit and component tests.

## Build tooling

### Vite
- Provides fast hot module replacement and bundling.
- Useful for quick local development and production builds.

### Tailwind CSS + PostCSS
- Styles are processed through PostCSS during the build.
- Useful for compiling custom CSS and applying Tailwind utilities.

## Why testing/build docs matter

- These docs help developers understand how to run the app locally and verify changes.
- They also explain which tools are responsible for bundling and styling.
