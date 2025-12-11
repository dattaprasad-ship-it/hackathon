import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersAndLoginAttempts1739123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "username" varchar(255) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "role" varchar(20) NOT NULL CHECK(role IN ('Admin', 'Employee')),
        "account_status" varchar(20) NOT NULL CHECK(account_status IN ('Active', 'Blocked', 'Suspended')),
        "display_name" varchar(255),
        "email" varchar(255),
        "last_login_at" datetime,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_users_username" ON "users" ("username")
    `);

    await queryRunner.query(`
      CREATE TABLE "login_attempts" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "username" varchar(255) NOT NULL,
        "ip_address" varchar(45) NOT NULL,
        "success" integer NOT NULL,
        "failure_reason" varchar(500),
        "attempt_timestamp" datetime NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_login_attempts_ip_timestamp" ON "login_attempts" ("ip_address", "attempt_timestamp")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_login_attempts_username_timestamp" ON "login_attempts" ("username", "attempt_timestamp")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('login_attempts');
    await queryRunner.dropTable('users');
  }
}
