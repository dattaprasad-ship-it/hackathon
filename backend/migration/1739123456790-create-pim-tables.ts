import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePimTables1739123456790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "job_titles" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "title" varchar(255) NOT NULL UNIQUE,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "employment_statuses" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "status" varchar(255) NOT NULL UNIQUE,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "sub_units" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL UNIQUE,
        "parent_id" varchar(36),
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255),
        FOREIGN KEY ("parent_id") REFERENCES "sub_units" ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "reporting_methods" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL UNIQUE,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "employee_id" varchar(255) NOT NULL UNIQUE,
        "first_name" varchar(255) NOT NULL,
        "middle_name" varchar(255),
        "last_name" varchar(255) NOT NULL,
        "job_title_id" varchar(36),
        "employment_status_id" varchar(36),
        "sub_unit_id" varchar(36),
        "supervisor_id" varchar(36),
        "reporting_method_id" varchar(36),
        "profile_photo_path" varchar(500),
        "username" varchar(255) UNIQUE,
        "password_hash" varchar(255),
        "login_status" varchar(20) CHECK(login_status IN ('Enabled', 'Disabled')),
        "is_deleted" integer NOT NULL DEFAULT 0,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255),
        FOREIGN KEY ("job_title_id") REFERENCES "job_titles" ("id"),
        FOREIGN KEY ("employment_status_id") REFERENCES "employment_statuses" ("id"),
        FOREIGN KEY ("sub_unit_id") REFERENCES "sub_units" ("id"),
        FOREIGN KEY ("supervisor_id") REFERENCES "employees" ("id"),
        FOREIGN KEY ("reporting_method_id") REFERENCES "reporting_methods" ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_employees_employee_id" ON "employees" ("employee_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_employees_employment_status" ON "employees" ("employment_status_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_employees_job_title" ON "employees" ("job_title_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_employees_sub_unit" ON "employees" ("sub_unit_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_employees_supervisor" ON "employees" ("supervisor_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_employees_is_deleted" ON "employees" ("is_deleted")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_employees_name" ON "employees" ("first_name", "last_name")
    `);

    await queryRunner.query(`
      CREATE TABLE "custom_fields" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "field_name" varchar(255) NOT NULL UNIQUE,
        "screen" varchar(255) NOT NULL,
        "field_type" varchar(50) NOT NULL CHECK(field_type IN ('Drop Down', 'Text or Number')),
        "select_options" text,
        "is_deleted" integer NOT NULL DEFAULT 0,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_custom_fields_field_name" ON "custom_fields" ("field_name")
    `);

    await queryRunner.query(`
      CREATE TABLE "employee_custom_values" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "employee_id" varchar(36) NOT NULL,
        "custom_field_id" varchar(36) NOT NULL,
        "value" text,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255),
        FOREIGN KEY ("employee_id") REFERENCES "employees" ("id"),
        FOREIGN KEY ("custom_field_id") REFERENCES "custom_fields" ("id"),
        UNIQUE ("employee_id", "custom_field_id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_employee_custom_values_employee" ON "employee_custom_values" ("employee_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_employee_custom_values_field" ON "employee_custom_values" ("custom_field_id")
    `);

    await queryRunner.query(`
      INSERT INTO "employment_statuses" ("id", "status") VALUES
      ('550e8400-e29b-41d4-a716-446655440001', 'Active'),
      ('550e8400-e29b-41d4-a716-446655440002', 'Inactive'),
      ('550e8400-e29b-41d4-a716-446655440003', 'Terminated')
    `);

    await queryRunner.query(`
      INSERT INTO "reporting_methods" ("id", "name") VALUES
      ('550e8400-e29b-41d4-a716-446655440010', 'Direct'),
      ('550e8400-e29b-41d4-a716-446655440011', 'Indirect')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('employee_custom_values');
    await queryRunner.dropTable('custom_fields');
    await queryRunner.dropTable('employees');
    await queryRunner.dropTable('reporting_methods');
    await queryRunner.dropTable('sub_units');
    await queryRunner.dropTable('employment_statuses');
    await queryRunner.dropTable('job_titles');
  }
}

