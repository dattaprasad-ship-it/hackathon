import { Entity, Column, OneToMany } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Employee } from './employee.entity';

@Entity('job_titles')
export class JobTitle extends Audit {
  @Column({ name: 'title', unique: true })
  title: string;

  @OneToMany(() => Employee, (employee) => employee.jobTitle)
  employees?: Employee[];
}

