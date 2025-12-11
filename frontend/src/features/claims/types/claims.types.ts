export type ClaimStatus =
  | 'Initiated'
  | 'Submitted'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'Paid'
  | 'Cancelled'
  | 'On Hold'
  | 'Partially Approved';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
}

export interface EventType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ExpenseType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  isActive: boolean;
}

export interface Expense {
  id: string;
  expenseType: {
    id: string;
    name: string;
  };
  expenseDate: string;
  amount: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  originalFilename: string;
  fileSize: number;
  fileType: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
}

export interface Claim {
  id: string;
  referenceId: string;
  employee: Employee;
  eventType: {
    id: string;
    name: string;
  };
  currency: {
    id: string;
    code: string;
    symbol: string;
  };
  status: ClaimStatus;
  remarks?: string;
  totalAmount: number;
  submittedDate?: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  approver?: {
    id: string;
    username: string;
    displayName?: string;
  };
  expenses?: Expense[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClaimRequest {
  employeeId: string;
  eventTypeId: string;
  currencyId: string;
  remarks?: string;
}

export interface UpdateClaimRequest {
  eventTypeId?: string;
  currencyId?: string;
  remarks?: string;
}

export type IncludeFilter =
  | 'current_employees_only'
  | 'past_employees_only'
  | 'all_employees'
  | 'active_claims_only'
  | 'closed_claims_only'
  | 'pending_payment';

export interface ClaimSearchFilters {
  employeeName?: string;
  referenceId?: string;
  eventTypeId?: string;
  status?: ClaimStatus;
  include?: IncludeFilter;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ClaimListResponse {
  claims: Claim[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RejectClaimRequest {
  rejectionReason: string;
}

export interface ClaimsConfig {
  eventTypes: EventType[];
  expenseTypes: ExpenseType[];
  currencies: Currency[];
}

