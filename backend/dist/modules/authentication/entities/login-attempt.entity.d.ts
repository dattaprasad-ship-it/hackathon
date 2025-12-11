import { Audit } from '../../../common/base/audit.entity';
export declare class LoginAttempt extends Audit {
    username: string;
    ipAddress: string;
    success: boolean;
    failureReason?: string;
    attemptTimestamp: Date;
}
//# sourceMappingURL=login-attempt.entity.d.ts.map