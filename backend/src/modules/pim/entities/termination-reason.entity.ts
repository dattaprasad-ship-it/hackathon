import { Entity, Column, OneToMany } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Employee } from './employee.entity';

@Entity('termination_reasons')
export class TerminationReason extends Audit {
  @Column({ name: 'name', unique: true })
  name: string;

  @OneToMany(() => Employee, (employee) => employee.terminationReason)
  employees?: Employee[];
}

