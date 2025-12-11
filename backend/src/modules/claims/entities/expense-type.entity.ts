import { Entity, Column, Index } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';

@Entity('expense_types')
@Index('idx_expense_types_name', ['name'])
@Index('idx_expense_types_is_active', ['isActive'])
export class ExpenseType extends Audit {
  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}

