# Grocery Fullstack Project Guide

## Overview
This repository is a full-stack grocery management application built with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Spring Boot + Spring Data JPA + Spring Security
- **Database**: PostgreSQL with Flyway migrations
- **DevOps**: Docker + Docker Compose

This guide explains the purpose of the main files and folders so a new learner can understand how the app is structured and why each area exists.

---

## 1. Root-level Files

### `README.md`
- Provides a quick summary of the project and its technology stack.
- Good starting point for newcomers to understand what the repository contains.

### `docker-compose.yml`
- Orchestrates the entire application as multiple services.
- Defines three services:
  - `postgres`: the database service
  - `spring`: the backend service
  - `frontend`: the React web client service
- Includes service dependencies, environment variables, ports, and persistent storage.
- Useful for running the full application locally with a single command.

### `postman_collection.json`
- Contains pre-built API requests for manual testing.
- Useful for learning or verifying backend endpoints without using the UI.

### `docs/`
- Contains project-level documentation and feature planning.
- Not code, but important for understanding design decisions and feature coverage.

---

## 2. Docker & Local Runtime

### `docker-compose.yml`
- **Why it exists**: it simplifies running frontend, backend, and database together.
- **Useful because**:
  - It creates a reproducible environment.
  - Developers can start the whole stack with one command.
  - It ensures the backend connects to the same database container every time.

### `frontend/Dockerfile`
- Defines how to build the frontend container.
- Installs Node dependencies and runs the Vite dev server.
- Useful for containerizing the React app so it can run in Docker the same way in every environment.

### `springboot-groceries/Dockerfile`
- Builds a Java container using the compiled JAR file.
- Exposes port `8080` and runs the Spring Boot app.
- Useful for packaging the backend as a deployable Docker image.

### Docker volume `pgdata`
- Persists PostgreSQL data between container restarts.
- Useful for keeping data safe during development and preventing data loss when restarting services.

---

## 3. Frontend Structure

### `frontend/package.json`
- Lists dependencies and dev tools used by the frontend.
- Includes commands such as:
  - `npm run dev`: start the Vite development server.
  - `npm run build`: create a production bundle.
  - `npm run test`: run frontend tests.
- Useful for understanding what libraries power the UI.

### `frontend/src/main.jsx`
- Entry point for the React application.
- Sets up:
  - `BrowserRouter` for client-side routing.
  - `AuthProvider` for authentication state.
  - `CartProvider` for shopping cart state.
- Useful for learning how global providers and routing are initialized.

### `frontend/src/App.jsx`
- Defines the main application routes.
- Separates user and admin paths.
- Uses `ProtectedRoute` to protect admin-only areas.
- Useful for understanding the navigation flow and how pages map to URLs.

### `frontend/src/index.css`
- Global CSS entry file.
- Useful for styles that apply across the entire app.

### `frontend/vite.config.js`
- Vite configuration file for the frontend build system.
- Useful for customizing development server settings and module handling.

### `frontend/tailwind.config.js`
- Tailwind CSS configuration.
- Useful for learning how utility CSS styles are set up and customized.

### `frontend/postcss.config.cjs`
- Configures PostCSS plugins used when building CSS.
- Useful for bundling Tailwind CSS and other CSS transformations.

### `frontend/tsconfig.json` and `tsconfig.node.json`
- TypeScript compiler settings.
- Useful for understanding module resolution and developer tooling in the frontend.

---

## 4. Frontend Key Directories

### `frontend/src/pages/`
- Contains page-level components for each route.
- Examples:
  - `Login.jsx`
  - `Register.jsx`
  - `Home.jsx`
  - `CartPage.jsx`
  - `CheckoutPage.jsx`
  - `AdminProducts.jsx`
- Useful for understanding the user flows and UI screens.

### `frontend/src/components/`
- Reusable UI components.
- Examples:
  - `ShoppingCart.jsx`
  - `ProductsGrid.jsx`
  - `ProductSkeletonGrid.jsx`
- Useful for building composable UI and avoiding duplicate code.

### `frontend/src/common/`
- Shared utility components used by several pages.
- Examples:
  - `Button.jsx`
  - `Card.jsx`
  - `Badge.jsx`
- Useful for common building blocks used across the app.

### `frontend/src/context/`
- React context providers for shared application state.
- Examples:
  - `AuthContext.jsx`: manages current user and auth token state.
  - `CartContext.jsx`: manages shopping cart operations.
- Useful for learning state management with React Context.

### `frontend/src/services/`
- Encapsulates API calls and service logic.
- Examples:
  - `groceryApi.js`
  - `adminapi.js`
  - `authServices.ts`
  - `voiceService.js`
- Useful for separating network logic from UI code.

### `frontend/src/api/`
- Contains API utilities and endpoint helpers.
- Examples:
  - `axios.js`: shared Axios instance with base URL and interceptors.
  - `urls.js`: API endpoint definitions.
- Useful to learn how HTTP clients are configured in React apps.

### `frontend/src/hooks/`
- Custom React hooks.
- Examples:
  - `useHomeDashboard.ts`
  - `useVoiceInput.js`
- Useful for extracting reusable logic from components.

### `frontend/src/layouts/`
- Page layout components used by different sections.
- Examples:
  - `layouts/user/UserLayout.jsx`
  - `layouts/admin/AdminLayout.jsx`
- Useful for learning how to create layout shells around pages.

### `frontend/src/routes/`
- Shared routing helpers and guards.
- Example:
  - `ProtectedRoute.jsx`: ensures a route requires authentication and specific roles.
- Useful for controlling access to protected pages.

### `frontend/src/styles/`
- Custom style files and CSS modules.
- Contains app styling such as card styles and theme definitions.
- Useful for understanding app-specific styling.

### `frontend/src/ui/`
- UI widgets and helper components.
- Usually stores smaller controls such as search bars or badges.
- Useful for building design-system pieces.

### `frontend/src/utils/`
- Utility functions used by the frontend.
- Useful for small helper functions that do not belong in components.

### `frontend/src/types/`
- Type definitions for TypeScript.
- Useful for safer code and better editor support.

---

## 5. Backend Structure

### `springboot-groceries/pom.xml`
- The Maven project descriptor.
- Lists backend dependencies:
  - `spring-boot-starter-web` for REST APIs
  - `spring-boot-starter-data-jpa` for database access
  - `spring-boot-starter-security` for authentication and authorization
  - `flyway-core` for schema migrations
  - `postgresql` JDBC driver
  - `spring-boot-starter-actuator` for observability
  - `lombok` for boilerplate reduction
- Useful for understanding the backend technology stack and build lifecycle.

### `springboot-groceries/Dockerfile`
- Packages the compiled Spring Boot JAR into a container.
- Useful for deploying the backend into Docker-based environments.

### `springboot-groceries/src/main/resources/application.properties`
- Main backend configuration.
- Contains database connection settings, Flyway settings, JPA settings, and server port.
- Useful for learning how Spring Boot is configured through property files.

### `springboot-groceries/src/main/java/com/example/groceries/GroceryApplication.java`
- The backend application entry point.
- Sets the JVM timezone and launches Spring Boot.
- Useful for seeing how a Spring Boot app starts.

---

## 6. Backend Folder Layout

The backend follows a standard layered architecture.

### `springboot-groceries/src/main/java/com/example/groceries/controller/`
- Contains REST controllers.
- These classes map HTTP requests to backend actions.
- Useful for understanding the API surface exposed to the frontend and other clients.

### `springboot-groceries/src/main/java/com/example/groceries/service/`
- Contains business logic and service classes.
- These classes orchestrate operations, apply validation, and call repositories.
- Useful for separating controller concerns from business rules.

### `springboot-groceries/src/main/java/com/example/groceries/repository/`
- Contains JPA repository interfaces.
- These interfaces talk to the database using Spring Data.
- Useful for learning how persistence is implemented in Spring Boot.

### `springboot-groceries/src/main/java/com/example/groceries/model/`
- Contains entity classes and data models.
- Useful for understanding the database schema and object mapping.

### `springboot-groceries/src/main/java/com/example/groceries/config/`
- Contains configuration classes:
  - `SecurityConfig.java`: sets authentication, authorization, and CORS.
  - `WebConfig.java`: custom MVC or web behavior.
  - `TimeConfig.java`: timezone-related setup.
  - `CategoryInitializer.java` / `UserInitializer.java`: seed data initialization.
- Useful for learning how Spring application behavior is customized.

### `springboot-groceries/src/main/java/com/example/groceries/security/`
- Contains security-related classes.
- Example:
  - `CustomUserDetailsService.java`: loads user details from the database.
  - `UserPrincipal.java`: stores authenticated user information.
- Useful for understanding Spring Security internals.

### `springboot-groceries/src/main/java/com/example/groceries/exception/`
- Contains custom exceptions and error handling logic.
- Useful for learning how the backend reports failures and validation errors.

### `springboot-groceries/src/main/java/com/example/groceries/audit/`
- Contains auditing/logging support.
- Useful for learning how to track changes and events over time.

---

## 7. Database & Migrations

### PostgreSQL service in `docker-compose.yml`
- Runs PostgreSQL version 15 inside Docker.
- Exposes port `5432` so the backend can connect to it.
- Stores data in the `pgdata` Docker volume for persistence.
- Useful for learning how to run a relational database in Docker.

### `springboot-groceries/src/main/resources/db/migration/common/`
- Contains Flyway SQL migration files.
- Files are versioned with `V1__...`, `V2__...`, etc.
- Example migrations:
  - `V1__baseline_schema.sql`: initial schema creation
  - `V2__add_unique_products_name.sql`: schema change for unique names
  - `V3__add_username_to_users.sql`: add username field
  - `R__seed_*`: data seed scripts for categories, products, users
- Useful for learning how database evolution is managed safely using migrations.

### `springboot-groceries/src/main/resources/application.properties`
- Controls Flyway behavior such as where migrations are loaded from.
- Useful to understand how DB migrations and schema validation are enabled.

---

## 8. Testing

### Frontend Testing
- The frontend contains tests in `frontend/src/__tests__`.
- Uses `vitest` and `@testing-library/react`.
- Useful for learning how React component and page tests are written.

### Backend Testing
- The backend includes test support through Maven and Spring Boot.
- Uses H2 database for in-memory tests.
- Useful for learning integration and unit testing of Spring Boot services.

---

## 9. How a Learner Should Explore the Project

1. **Start at the root**
   - Read `README.md` and `docker-compose.yml`.
   - Understand the services and how they connect.

2. **Open the frontend**
   - Inspect `frontend/src/main.jsx` and `frontend/src/App.jsx`.
   - Explore `pages/`, `components/`, and `context/`.
   - Run `npm install` and `npm run dev` to see the app in action.

3. **Explore the backend**
   - Read `springboot-groceries/pom.xml`.
   - Open `GroceryApplication.java` and `SecurityConfig.java`.
   - Study packages like `controller/`, `service/`, `repository/`, and `model/`.

4. **Understand the database**
   - Review `application.properties` for PostgreSQL settings.
   - Read the Flyway migrations under `db/migration/common`.

5. **Run the full stack with Docker**
   - Use `docker compose up --build` from the repository root.
   - Observe how the frontend, backend, and database come up together.

6. **Use the Postman collection**
   - Import `postman_collection.json` into Postman.
   - Execute API calls to inspect backend behavior directly.

---

## 10. Why these files matter for learning

- `docker-compose.yml`: teaches service orchestration and local environment setup.
- `frontend/package.json`: teaches dependency management and frontend tooling.
- `springboot-groceries/pom.xml`: teaches backend dependency and build setup.
- `application.properties`: teaches Spring Boot configuration and environment setup.
- `db/migration/common`: teaches database migrations and schema versioning.
- `src/main/java/...`: teaches backend architecture, from REST controllers to database models.
- `src/main/resources`: teaches how application settings and data seeds are stored.
- `src/pages` + `src/components`: teach how frontend UI is built and organized.
- `src/context` + `src/services`: teach state management and API integration.

---

## 11. Quick start commands

From the root directory:

```bash
# Run full stack with Docker
docker compose up --build
```

From the frontend directory:

```bash
npm install
npm run dev
```

From the backend directory:

```bash
./mvnw spring-boot:run
```

> Note: if `./mvnw` is not present, use `mvn spring-boot:run` after installing Maven.
