import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTerminationReasons1739123456801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "termination_reasons" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL UNIQUE,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_termination_reasons_name" ON "termination_reasons" ("name")
    `);

    // Insert predefined termination reasons
    const reasons = [
      'Contract Not Renewed',
      'Deceased',
      'Dismissed',
      'Laid-off',
      'Other',
      'Physically Disabled/Compensated',
      'Resigned',
      'Resigned - Company Requested',
    ];

    for (const reason of reasons) {
      await queryRunner.query(`
        INSERT INTO termination_reasons (id, name, created_at, updated_at, created_by, updated_by)
        VALUES (
          lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
          ?,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP,
          'system',
          'system'
        )
      `, [reason]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "termination_reasons"`);
  }
}

