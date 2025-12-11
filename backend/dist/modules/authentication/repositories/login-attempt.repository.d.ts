import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { LoginAttempt } from '../entities/login-attempt.entity';
export declare class LoginAttemptRepository extends IGenericRepository<LoginAttempt> {
    constructor(repository: Repository<LoginAttempt>);
    createAttempt(attempt: {
        username: string;
        ipAddress: string;
        success: boolean;
        failureReason?: string;
        attemptTimestamp: Date;
    }): Promise<LoginAttempt>;
    findRecentAttemptsByIp(ipAddress: string, since: Date): Promise<LoginAttempt[]>;
    findRecentAttemptsByUsername(username: string, since: Date): Promise<LoginAttempt[]>;
    countRecentAttemptsByIp(ipAddress: string, since: Date): Promise<number>;
    countRecentAttemptsByUsername(username: string, since: Date): Promise<number>;
}
//# sourceMappingURL=login-attempt.repository.d.ts.map