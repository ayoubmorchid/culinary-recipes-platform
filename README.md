# Culinary Recipes Platform

Spring Boot + React recipe platform with JWT authentication, recipe CRUD, favorites, comments, profiles, image uploads, and seeded Moroccan recipes.

## Technology Stack

- Java 17
- Maven 3.8+ recommended, Maven 3.9+ preferred
- Spring Boot 3.2.0
- MySQL 8.x by default
- H2 optional dev profile
- Node.js 18+ recommended, Node 20 or 22 LTS preferred
- npm 9+
- React 18.2.0
- Vite 5.x
- Docker optional

## Project Structure

```text
backend/   Spring Boot REST API
frontend/  React + Vite app
docs/      Project notes
```

## Backend Configuration

Default backend configuration lives in:

```text
backend/src/main/resources/application.properties
```

Example configuration:

```text
backend/src/main/resources/application.example.properties
```

Supported environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION_MS
```

Defaults are suitable for local MySQL:

```text
DB_URL=jdbc:mysql://localhost:3306/culinary_recipes_platform
DB_USERNAME=root
DB_PASSWORD=
```

## MySQL Setup

Create the database manually if you are running MySQL outside Docker:

```sql
CREATE DATABASE culinary_recipes_platform;
```

Then start the backend:

```powershell
cd backend
mvn test
mvn spring-boot:run
```

On Windows PowerShell, if `mvn` gives an access or script execution issue, use:

```powershell
cmd /c mvn test
cmd /c mvn spring-boot:run
```

## Docker MySQL Setup

Start MySQL 8 with Docker Compose:

```powershell
docker compose up -d mysql
```

Then run the backend:

```powershell
cd backend
mvn spring-boot:run
```

Stop MySQL:

```powershell
docker compose down
```

Remove the MySQL volume if you want a clean database:

```powershell
docker compose down -v
```

## H2 Dev Profile

If you do not want to install or run MySQL, use the H2 dev profile:

```powershell
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

H2 console:

```text
http://localhost:8080/h2-console
```

JDBC URL:

```text
jdbc:h2:file:./data/culinary-recipes-dev
```

## Frontend Configuration

Example env file:

```text
frontend/.env.example
```

Default API URL:

```text
VITE_API_URL=http://localhost:8080/api
VITE_API_BASE_URL=http://localhost:8080
```

Install and start:

```powershell
cd frontend
npm install
npm run build
npm run dev
```

On Windows PowerShell, if `npm` is blocked by execution policy, use:

```powershell
npm.cmd install
npm.cmd run build
npm.cmd run dev
```

Open:

```text
http://localhost:5173
```

## Correct Startup Order

1. Start MySQL, or start Docker MySQL:

```powershell
docker compose up -d mysql
```

2. Start backend:

```powershell
cd backend
mvn spring-boot:run
```

3. Start frontend:

```powershell
cd frontend
npm run dev
```

4. Open:

```text
http://localhost:5173
```

## Useful URLs

```text
Frontend:      http://localhost:5173
Backend API:   http://localhost:8080/api
Recipes API:   http://localhost:8080/api/recipes
H2 Console:    http://localhost:8080/h2-console
```

## Verification Checklist

- `java -version` shows Java 17.
- `mvn -version` works.
- `node --version` shows Node 18+.
- `npm --version` shows npm 9+.
- MySQL listens on port 3306, or H2 dev profile is used.
- `cd backend && mvn test` succeeds.
- `cd frontend && npm run build` succeeds.
- Backend starts on port 8080.
- Frontend starts on port 5173.
- `http://localhost:8080/api/recipes` returns recipes.
- Home page loads.
- Recipe list loads.
- Recipe detail page loads.
- Register and login work.
- Create, edit, delete recipe routes use the backend API correctly.
- Favorite toggle works after login.
- Comments display correctly.
- Uploaded images display from `/uploads/**`.
- Seeded static images display from `/images/**`.
- Browser console has no CORS errors.

## Troubleshooting

### Backend: Communications link failure

MySQL is not running, port 3306 is blocked, or the database does not exist.

Fix:

```powershell
docker compose up -d mysql
```

Or create the database manually:

```sql
CREATE DATABASE culinary_recipes_platform;
```

### Frontend: CORS error

Make sure the backend is running and `app.cors.allowed-origins` includes the frontend origin:

```properties
app.cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

### PowerShell blocks npm

Use `npm.cmd`:

```powershell
npm.cmd run dev
```

### PowerShell or Windows blocks Maven

Use:

```powershell
cmd /c mvn spring-boot:run
```
