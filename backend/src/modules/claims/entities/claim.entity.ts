import { Entity, Column, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Employee } from '../../pim/entities/employee.entity';
import { EventType } from './event-type.entity';
import { Currency } from './currency.entity';
import { User } from '../../authentication/entities/user.entity';
import { Expense } from './expense.entity';
import { Attachment } from './attachment.entity';

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

@Entity('claims')
@Index('idx_claims_reference_id', ['referenceId'])
@Index('idx_claims_employee_id', ['employee'])
@Index('idx_claims_status', ['status'])
@Index('idx_claims_event_type_id', ['eventType'])
@Index('idx_claims_currency_id', ['currency'])
@Index('idx_claims_submitted_date', ['submittedDate'])
@Index('idx_claims_created_at', ['createdAt'])
export class Claim extends Audit {
  @Column({ name: 'reference_id', unique: true, length: 20 })
  referenceId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => EventType)
  @JoinColumn({ name: 'event_type_id' })
  eventType: EventType;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: ClaimStatus;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks?: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ name: 'submitted_date', type: 'datetime', nullable: true })
  submittedDate?: Date;

  @Column({ name: 'approved_date', type: 'datetime', nullable: true })
  approvedDate?: Date;

  @Column({ name: 'rejected_date', type: 'datetime', nullable: true })
  rejectedDate?: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approver_id' })
  approver?: User;

  @OneToMany(() => Expense, (expense) => expense.claim)
  expenses?: Expense[];

  @OneToMany(() => Attachment, (attachment) => attachment.claim)
  attachments?: Attachment[];
}

