# LeoVegas Challenge by Gonzalo Prelatto

<img width="1481" alt="image" src="https://github.com/user-attachments/assets/45300c6f-cf0b-44df-9c5b-8b958f0038e8" />

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
2. If setting up a new environment, run migrations (this step is not necessary since a pre-seeded database is already included):
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

### Possible improvements
- Use a cloud database for data persistence (MySQL, PostgreSQL, etc.).
- Improve test coverage.
- Implement an interceptor or serializer to improve data return logic (JSON:API formatting).
- Create a new endpoint to change passwords.
- Implement a password policy (currently, there are no policies in place).
- Containerize the application using Docker to standardize the service.
- Set up a CI/CD pipeline to automate deployments and database migrations.
- Orchestrate the application using Kubernetes to ensure auto-scaling and high availability.

## GitHub Actions
A CI pipeline is configured to execute build and test processes on GitHub, ensuring project stability.
