import { Router } from 'express';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { Repository } from 'typeorm';
import { TerminationReason } from '../entities/termination-reason.entity';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
declare class TerminationReasonRepository extends IGenericRepository<TerminationReason> {
    constructor(repository: Repository<TerminationReason>);
}
export declare const createTerminationReasonsRoutes: (terminationReasonRepository: TerminationReasonRepository, userRepository: UserRepository) => Router;
export {};
//# sourceMappingURL=termination-reasons.routes.d.ts.map