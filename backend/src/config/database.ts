import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../modules/authentication/entities/user.entity';
import { LoginAttempt } from '../modules/authentication/entities/login-attempt.entity';
import { Employee } from '../modules/pim/entities/employee.entity';
import { JobTitle } from '../modules/pim/entities/job-title.entity';
import { EmploymentStatus } from '../modules/pim/entities/employment-status.entity';
import { SubUnit } from '../modules/pim/entities/sub-unit.entity';
import { ReportingMethod } from '../modules/pim/entities/reporting-method.entity';
import { CustomField } from '../modules/pim/entities/custom-field.entity';
import { EmployeeCustomValue } from '../modules/pim/entities/employee-custom-value.entity';
import { Report } from '../modules/pim/entities/report.entity';
import { ReportSelectionCriteria } from '../modules/pim/entities/report-selection-criteria.entity';
import { ReportDisplayField } from '../modules/pim/entities/report-display-field.entity';
import { PimConfig } from '../modules/pim/entities/pim-config.entity';
import { TerminationReason } from '../modules/pim/entities/termination-reason.entity';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/hr_management.db');
const dbDirectory = path.dirname(dbPath);

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const dataSourceOptions: DataSourceOptions = {
  type: 'better-sqlite3',
  database: dbPath,
  entities: [
    User,
    LoginAttempt,
    Employee,
    JobTitle,
    EmploymentStatus,
    SubUnit,
    ReportingMethod,
    CustomField,
    EmployeeCustomValue,
    Report,
    ReportSelectionCriteria,
    ReportDisplayField,
    PimConfig,
    TerminationReason,
  ],
  migrations: [path.join(__dirname, '../../migration/*.ts')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

export const AppDataSource = new DataSource(dataSourceOptions);

export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();

      const driver = AppDataSource.driver as any;
      if (driver && driver.database && driver.database.exec) {
        driver.database.exec('PRAGMA foreign_keys = ON;');
        driver.database.exec('PRAGMA journal_mode = WAL;');
      }

      console.log('Database connection established');
      console.log(`SQLite database: ${dbPath}`);
    }
  } catch (error) {
    console.error('\n❌ Error during database initialization:', error);
    if (error instanceof Error) {
      console.error('\n📋 Database Error Details:');
      console.error(`   Message: ${error.message}`);
      console.error('\n💡 Possible Solutions:');
      console.error('   1. Ensure the database directory exists and is writable');
      console.error('   2. Check file permissions on the database file');
      console.error('   3. Verify better-sqlite3 package is installed correctly');
      console.error('   4. Default database path:');
      console.error(`      ${dbPath}`);
      console.error('\n📝 Quick Setup:');
      console.error('   The database file will be created automatically.');
      console.error('   Set DB_PATH in .env to customize the location.\n');
    }
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
    if (error instanceof Error) {
      console.error(`   Error details: ${error.message}`);
    }
    throw error;
  }
};

