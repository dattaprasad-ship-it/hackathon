import { Entity, Column, OneToMany } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Employee } from './employee.entity';

@Entity('employment_statuses')
export class EmploymentStatus extends Audit {
  @Column({ name: 'status', unique: true })
  status: string;

  @OneToMany(() => Employee, (employee) => employee.employmentStatus)
  employees?: Employee[];
}

