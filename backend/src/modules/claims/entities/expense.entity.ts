import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Claim } from './claim.entity';
import { ExpenseType } from './expense-type.entity';

@Entity('expenses')
@Index('idx_expenses_claim_id', ['claim'])
@Index('idx_expenses_expense_type_id', ['expenseType'])
@Index('idx_expenses_expense_date', ['expenseDate'])
export class Expense extends Audit {
  @ManyToOne(() => Claim, (claim) => claim.expenses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @ManyToOne(() => ExpenseType)
  @JoinColumn({ name: 'expense_type_id' })
  expenseType: ExpenseType;

  @Column({ name: 'expense_date', type: 'date' })
  expenseDate: Date;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'note', type: 'text', nullable: true })
  note?: string;
}

