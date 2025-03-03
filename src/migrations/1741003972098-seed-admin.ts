import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAdmin1666789588207 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "user" ("id", "name","email", "password", "role") VALUES ('6e71a210-5fb0-477d-a71a-b5eb1374d1f2', 'Admin','admin@leovegas.es', '$2b$10$Rl1cChlMDtiGG0hBrVqBIO3MKALOKNxp1uYscVW0VWk4UqEfXdYma', 'admin')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user" WHERE "username" = 'admin'`);
  }
}
