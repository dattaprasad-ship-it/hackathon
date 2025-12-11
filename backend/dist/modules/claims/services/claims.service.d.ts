import { ClaimRepository } from '../repositories/claim.repository';
import { EmployeeRepository } from '../../pim/repositories/employee.repository';
import { EventTypeRepository } from '../repositories/event-type.repository';
import { CurrencyRepository } from '../repositories/currency.repository';
import { ExpenseRepository } from '../repositories/expense.repository';
import { Claim } from '../entities/claim.entity';
import { User } from '../../authentication/entities/user.entity';
import { CreateClaimDto, UpdateClaimDto, ClaimSearchFiltersDto, RejectClaimDto } from '../dto/claims.dto';
export declare class ClaimsService {
    private readonly claimRepository;
    private readonly employeeRepository;
    private readonly eventTypeRepository;
    private readonly currencyRepository;
    private readonly expenseRepository;
    constructor(claimRepository: ClaimRepository, employeeRepository: EmployeeRepository, eventTypeRepository: EventTypeRepository, currencyRepository: CurrencyRepository, expenseRepository: ExpenseRepository);
    create(dto: CreateClaimDto, user: User): Promise<Claim>;
    search(filters: ClaimSearchFiltersDto): Promise<{
        claims: Claim[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<Claim>;
    findByEmployeeId(employeeId: string): Promise<Claim[]>;
    update(id: string, dto: UpdateClaimDto, user: User): Promise<Claim>;
    submit(id: string, user: User): Promise<void>;
    approve(id: string, user: User): Promise<void>;
    reject(id: string, dto: RejectClaimDto, user: User): Promise<void>;
    /**
     * Check if user has access to view/modify a claim
     * Employees can only access their own claims
     * Admin can access all claims
     */
    canAccessClaim(claim: Claim, user: User, employeeId?: string): boolean;
}
//# sourceMappingURL=claims.service.d.ts.map