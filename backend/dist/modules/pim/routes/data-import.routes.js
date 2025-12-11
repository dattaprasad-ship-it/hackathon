"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataImportRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const logger_1 = require("../../../utils/logger");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV files are allowed'));
        }
    },
});
const createDataImportRoutes = (dataImportService, userRepository) => {
    const router = (0, express_1.Router)();
    router.use((0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository));
    router.post('/upload', upload.single('file'), async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const result = await dataImportService.importFromCSV(req.file);
            res.status(200).json(result);
        }
        catch (error) {
            logger_1.logger.error(`Error importing data: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    return router;
};
exports.createDataImportRoutes = createDataImportRoutes;
//# sourceMappingURL=data-import.routes.js.map