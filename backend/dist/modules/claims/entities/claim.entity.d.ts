import { Audit } from '../../../common/base/audit.entity';
import { Employee } from '../../pim/entities/employee.entity';
import { EventType } from './event-type.entity';
import { Currency } from './currency.entity';
import { User } from '../../authentication/entities/user.entity';
import { Expense } from './expense.entity';
import { Attachment } from './attachment.entity';
export type ClaimStatus = 'Initiated' | 'Submitted' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Paid' | 'Cancelled' | 'On Hold' | 'Partially Approved';
export declare class Claim extends Audit {
    referenceId: string;
    employee: Employee;
    eventType: EventType;
    currency: Currency;
    status: ClaimStatus;
    remarks?: string;
    totalAmount: number;
    submittedDate?: Date;
    approvedDate?: Date;
    rejectedDate?: Date;
    rejectionReason?: string;
    approver?: User;
    expenses?: Expense[];
    attachments?: Attachment[];
}
//# sourceMappingURL=claim.entity.d.ts.map