"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../modules/authentication/entities/user.entity");
const login_attempt_entity_1 = require("../modules/authentication/entities/login-attempt.entity");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
dotenv.config();
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/hr_management.db');
const dbDirectory = path.dirname(dbPath);
if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
}
const dataSourceOptions = {
    type: 'better-sqlite3',
    database: dbPath,
    entities: [user_entity_1.User, login_attempt_entity_1.LoginAttempt],
    migrations: [path.join(__dirname, '../../migration/*.ts')],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
};
exports.AppDataSource = new typeorm_1.DataSource(dataSourceOptions);
const initializeDatabase = async () => {
    try {
        if (!exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.initialize();
            const driver = exports.AppDataSource.driver;
            if (driver && driver.database && driver.database.exec) {
                driver.database.exec('PRAGMA foreign_keys = ON;');
                driver.database.exec('PRAGMA journal_mode = WAL;');
            }
            console.log('Database connection established');
            console.log(`SQLite database: ${dbPath}`);
        }
    }
    catch (error) {
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
exports.initializeDatabase = initializeDatabase;
const closeDatabase = async () => {
    try {
        if (exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.destroy();
            console.log('Database connection closed');
        }
    }
    catch (error) {
        console.error('Error closing database connection:', error);
        if (error instanceof Error) {
            console.error(`   Error details: ${error.message}`);
        }
        throw error;
    }
};
exports.closeDatabase = closeDatabase;
//# sourceMappingURL=database.js.map