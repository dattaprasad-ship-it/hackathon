import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClaimsTables1739123456802 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create event_types table
    await queryRunner.query(`
      CREATE TABLE "event_types" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL UNIQUE,
        "description" text,
        "is_active" integer NOT NULL DEFAULT 1,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_event_types_name" ON "event_types" ("name")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_event_types_is_active" ON "event_types" ("is_active")
    `);

    // Create expense_types table
    await queryRunner.query(`
      CREATE TABLE "expense_types" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL UNIQUE,
        "description" text,
        "is_active" integer NOT NULL DEFAULT 1,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_expense_types_name" ON "expense_types" ("name")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_expense_types_is_active" ON "expense_types" ("is_active")
    `);

    // Create currencies table
    await queryRunner.query(`
      CREATE TABLE "currencies" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "code" varchar(3) NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "symbol" varchar(10) NOT NULL,
        "is_active" integer NOT NULL DEFAULT 1,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_currencies_code" ON "currencies" ("code")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_currencies_is_active" ON "currencies" ("is_active")
    `);

    // Create claims table
    await queryRunner.query(`
      CREATE TABLE "claims" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "reference_id" varchar(20) NOT NULL UNIQUE,
        "employee_id" varchar(36) NOT NULL,
        "event_type_id" varchar(36) NOT NULL,
        "currency_id" varchar(36) NOT NULL,
        "status" varchar(20) NOT NULL CHECK(status IN ('Initiated', 'Submitted', 'Pending Approval', 'Approved', 'Rejected', 'Paid', 'Cancelled', 'On Hold', 'Partially Approved')),
        "remarks" text,
        "total_amount" decimal(10,2) NOT NULL DEFAULT 0,
        "submitted_date" datetime,
        "approved_date" datetime,
        "rejected_date" datetime,
        "rejection_reason" text,
        "approver_id" varchar(36),
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255),
        FOREIGN KEY ("employee_id") REFERENCES "employees" ("id"),
        FOREIGN KEY ("event_type_id") REFERENCES "event_types" ("id"),
        FOREIGN KEY ("currency_id") REFERENCES "currencies" ("id"),
        FOREIGN KEY ("approver_id") REFERENCES "users" ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_claims_reference_id" ON "claims" ("reference_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_claims_employee_id" ON "claims" ("employee_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_claims_status" ON "claims" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_claims_event_type_id" ON "claims" ("event_type_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_claims_currency_id" ON "claims" ("currency_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_claims_submitted_date" ON "claims" ("submitted_date")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_claims_created_at" ON "claims" ("created_at")
    `);

    // Create expenses table
    await queryRunner.query(`
      CREATE TABLE "expenses" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "claim_id" varchar(36) NOT NULL,
        "expense_type_id" varchar(36) NOT NULL,
        "expense_date" date NOT NULL,
        "amount" decimal(10,2) NOT NULL,
        "note" text,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255),
        FOREIGN KEY ("claim_id") REFERENCES "claims" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("expense_type_id") REFERENCES "expense_types" ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_expenses_claim_id" ON "expenses" ("claim_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_expenses_expense_type_id" ON "expenses" ("expense_type_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_expenses_expense_date" ON "expenses" ("expense_date")
    `);

    // Create attachments table
    await queryRunner.query(`
      CREATE TABLE "attachments" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "claim_id" varchar(36) NOT NULL,
        "original_filename" varchar(255) NOT NULL,
        "stored_filename" varchar(255) NOT NULL UNIQUE,
        "file_size" integer NOT NULL,
        "file_type" varchar(100) NOT NULL,
        "description" text,
        "file_path" varchar(500) NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255),
        FOREIGN KEY ("claim_id") REFERENCES "claims" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_attachments_claim_id" ON "attachments" ("claim_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_attachments_stored_filename" ON "attachments" ("stored_filename")
    `);

    // Create audit_logs table
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "entity_type" varchar(50) NOT NULL,
        "entity_id" varchar(36) NOT NULL,
        "action" varchar(20) NOT NULL,
        "user_id" varchar(36) NOT NULL,
        "old_values" text,
        "new_values" text,
        "ip_address" varchar(45),
        "user_agent" text,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255),
        FOREIGN KEY ("user_id") REFERENCES "users" ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_audit_logs_entity_type_id" ON "audit_logs" ("entity_type", "entity_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_audit_logs_action" ON "audit_logs" ("action")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" ("created_at")
    `);

    // Insert default event types
    const eventTypes = [
      { name: 'Travel Allowance', description: 'Travel expense claims' },
      { name: 'Medical Reimbursement', description: 'Medical expense claims' },
      { name: 'Accommodation', description: 'Accommodation expense claims' },
      { name: 'Meals & Entertainment', description: 'Meals and entertainment expenses' },
      { name: 'Other', description: 'Other expense claims' },
    ];

    for (const eventType of eventTypes) {
      await queryRunner.query(`
        INSERT INTO event_types (id, name, description, is_active, created_at, updated_at, created_by, updated_by)
        VALUES (
          lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
          ?,
          ?,
          1,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP,
          'system',
          'system'
        )
      `, [eventType.name, eventType.description]);
    }

    // Insert default expense types
    const expenseTypes = [
      { name: 'Travel Expenses', description: 'Travel related expenses' },
      { name: 'Accommodation', description: 'Hotel and accommodation expenses' },
      { name: 'Meals & Entertainment', description: 'Meals and entertainment expenses' },
      { name: 'Transportation', description: 'Transportation expenses' },
      { name: 'Other', description: 'Other expenses' },
    ];

    for (const expenseType of expenseTypes) {
      await queryRunner.query(`
        INSERT INTO expense_types (id, name, description, is_active, created_at, updated_at, created_by, updated_by)
        VALUES (
          lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
          ?,
          ?,
          1,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP,
          'system',
          'system'
        )
      `, [expenseType.name, expenseType.description]);
    }

    // Insert default currencies
    const currencies = [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    ];

    for (const currency of currencies) {
      await queryRunner.query(`
        INSERT INTO currencies (id, code, name, symbol, is_active, created_at, updated_at, created_by, updated_by)
        VALUES (
          lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
          ?,
          ?,
          ?,
          1,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP,
          'system',
          'system'
        )
      `, [currency.code, currency.name, currency.symbol]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "attachments"`);
    await queryRunner.query(`DROP TABLE "expenses"`);
    await queryRunner.query(`DROP TABLE "claims"`);
    await queryRunner.query(`DROP TABLE "currencies"`);
    await queryRunner.query(`DROP TABLE "expense_types"`);
    await queryRunner.query(`DROP TABLE "event_types"`);
  }
}

