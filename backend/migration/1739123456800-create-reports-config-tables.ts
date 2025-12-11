import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class CreateReportsConfigTables1739123456800 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Reports table
    await queryRunner.query(`
      CREATE TABLE "reports" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "report_name" varchar(255) NOT NULL UNIQUE,
        "is_predefined" integer NOT NULL DEFAULT 0,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_reports_report_name" ON "reports" ("report_name")`);

    // Create Report Selection Criteria table
    await queryRunner.query(`
      CREATE TABLE "report_selection_criteria" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "report_id" varchar(36) NOT NULL,
        "criteria_type" varchar(255) NOT NULL,
        "criteria_value" varchar(255) NOT NULL,
        "include_option" varchar(255),
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255),
        FOREIGN KEY ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_report_criteria_report" ON "report_selection_criteria" ("report_id")`);

    // Create Report Display Fields table
    await queryRunner.query(`
      CREATE TABLE "report_display_fields" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "report_id" varchar(36) NOT NULL,
        "field_group" varchar(255) NOT NULL,
        "field_name" varchar(255) NOT NULL,
        "include_header" integer NOT NULL DEFAULT 0,
        "display_order" integer NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255),
        FOREIGN KEY ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_report_display_fields_report" ON "report_display_fields" ("report_id")`);
    await queryRunner.query(`CREATE INDEX "idx_report_display_fields_order" ON "report_display_fields" ("report_id", "display_order")`);

    // Create PIM Config table (single row configuration)
    await queryRunner.query(`
      CREATE TABLE "pim_config" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "show_deprecated_fields" integer NOT NULL DEFAULT 0,
        "show_ssn_field" integer NOT NULL DEFAULT 0,
        "show_sin_field" integer NOT NULL DEFAULT 0,
        "show_us_tax_exemptions" integer NOT NULL DEFAULT 0,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    // Insert default PIM config
    const configId = uuidv4();
    await queryRunner.query(`
      INSERT INTO "pim_config" ("id", "show_deprecated_fields", "show_ssn_field", "show_sin_field", "show_us_tax_exemptions")
      VALUES ('${configId}', 0, 0, 0, 0)
    `);

    // Insert predefined reports
    const predefinedReports = [
      'All Employee Sub Unit Hierarchy Report',
      'Employee Contact info report',
      'Employee Job Details',
      'PIM Sample Report',
      'PT',
    ];

    for (const reportName of predefinedReports) {
      const reportId = uuidv4();
      await queryRunner.query(`
        INSERT INTO "reports" ("id", "report_name", "is_predefined")
        VALUES ('${reportId}', '${reportName}', 1)
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('report_display_fields');
    await queryRunner.dropTable('report_selection_criteria');
    await queryRunner.dropTable('reports');
    await queryRunner.dropTable('pim_config');
  }
}

