# Frontend Overview

The frontend is located in `frontend/` and is a modern React application created with Vite.

## Purpose

This layer provides the user interface for shoppers and administrators. It communicates with the Spring Boot backend through HTTP APIs and renders pages, forms, and dashboards.

## Key technologies

- **React**: component-based UI.
- **Vite**: fast development server and build tool.
- **Tailwind CSS**: utility-first styling.
- **Axios**: API requests.
- **React Router**: client-side routing.
- **React Context**: global state like auth and cart.

## Project structure

- `src/main.jsx`: app entrypoint and provider setup.
- `src/App.jsx`: route definitions.
- `src/pages/`: page-level views.
- `src/components/`: reusable user-facing components.
- `src/common/`: shared UI pieces.
- `src/context/`: global state providers.
- `src/api/`: HTTP client and endpoint utilities.
- `src/services/`: business service helpers and API wrappers.
- `src/ifli/`: advanced voice and interface logic.
- `src/layouts/`: layout shells for user and admin sections.
- `src/hooks/`: custom React hooks.
- `src/styles/`: styling files and themes.
- `src/assets/`: static assets and images.
- `src/utils/`: generic frontend utilities.

## Why this structure?

- Separates concerns between pages, components, and services.
- Keeps state management isolated from UI components.
- Makes API integration reusable and consistent.
- Enables admin and user sections to share common layout patterns.
