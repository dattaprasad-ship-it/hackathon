"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./config/database");
const PORT = process.env.PORT || 3001;
const startServer = async () => {
    try {
        await (0, database_1.initializeDatabase)();
        const app = (0, app_1.createApp)();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        process.on('SIGTERM', async () => {
            console.log('SIGTERM signal received: closing HTTP server');
            await (0, database_1.closeDatabase)();
            process.exit(0);
        });
        process.on('SIGINT', async () => {
            console.log('SIGINT signal received: closing HTTP server');
            await (0, database_1.closeDatabase)();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('\n❌ Failed to start server:', error);
        console.error('\n⚠️  Server cannot start without a database connection.');
        console.error('   Please check the database configuration and ensure SQLite is accessible.\n');
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map