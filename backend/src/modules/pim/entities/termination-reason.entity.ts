import { Entity, Column } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';

@Entity('termination_reasons')
export class TerminationReason extends Audit {
  @Column({ name: 'name', unique: true })
  name: string;
}

