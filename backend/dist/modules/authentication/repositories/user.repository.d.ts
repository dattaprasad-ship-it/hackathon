import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { User } from '../entities/user.entity';
export declare class UserRepository extends IGenericRepository<User> {
    constructor(repository: Repository<User>);
    findByUsername(username: string): Promise<User | null>;
    updateLastLogin(userId: string, lastLoginAt: Date): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map