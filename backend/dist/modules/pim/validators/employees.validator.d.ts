import { ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
export declare const validateCreateEmployee: ValidationChain[];
export declare const validateUpdateEmployee: ValidationChain[];
export declare const validateEmployeeListQuery: ValidationChain[];
export declare const validate: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=employees.validator.d.ts.map