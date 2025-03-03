# LeoVegas Challenge by Gonzalo Prelatto

## Technologies
- TypeScript
- Node.js + NestJS
- TypeORM
- Jest
- SQLite
- Swagger

## How to Start
The repository already includes a seed of data to test the different endpoints.

### Steps to run the project:
1. Install dependencies:
   ```sh
   npm install
   ```
2. If setting up a new environment, run migrations:
   ```sh
   npm run migrate
   ```
3. Start the development server:
   ```sh
   npm run start:dev
   ```

### Configuration
- The startup port can be configured in the environment files.
- Default access:
  - API Base URL: `http://localhost:3000`
  - API Documentation (Swagger): `http://localhost:3000/swagger`
  - Admin Credentials: `admin@leovegas.es / 123asd123`

## GitHub Actions
A CI pipeline is configured to execute build and test processes on GitHub, ensuring project stability.
