import { Entity, Column, OneToMany } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Employee } from './employee.entity';

@Entity('reporting_methods')
export class ReportingMethod extends Audit {
  @Column({ name: 'name', unique: true })
  name: string;

  @OneToMany(() => Employee, (employee) => employee.reportingMethod)
  employees?: Employee[];
}

