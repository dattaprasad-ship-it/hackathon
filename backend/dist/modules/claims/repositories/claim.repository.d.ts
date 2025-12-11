import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Claim } from '../entities/claim.entity';
export declare class ClaimRepository extends IGenericRepository<Claim> {
    constructor(repository: Repository<Claim>);
    findByReferenceId(referenceId: string): Promise<Claim | null>;
    findByEmployeeId(employeeId: string): Promise<Claim[]>;
    findByIdWithRelations(id: string): Promise<Claim | null>;
    findWithFilters(filters: {
        employeeName?: string;
        referenceId?: string;
        eventTypeId?: string;
        status?: Claim['status'];
        fromDate?: Date;
        toDate?: Date;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
    }): Promise<{
        claims: Claim[];
        total: number;
    }>;
}
//# sourceMappingURL=claim.repository.d.ts.map