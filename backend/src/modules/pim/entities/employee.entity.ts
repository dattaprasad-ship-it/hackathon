import { Entity, Column, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { JobTitle } from './job-title.entity';
import { EmploymentStatus } from './employment-status.entity';
import { SubUnit } from './sub-unit.entity';
import { ReportingMethod } from './reporting-method.entity';
import { EmployeeCustomValue } from './employee-custom-value.entity';

@Entity('employees')
@Index('idx_employees_employee_id', ['employeeId'])
@Index('idx_employees_employment_status', ['employmentStatus'])
@Index('idx_employees_job_title', ['jobTitle'])
@Index('idx_employees_sub_unit', ['subUnit'])
@Index('idx_employees_supervisor', ['supervisor'])
@Index('idx_employees_is_deleted', ['isDeleted'])
@Index('idx_employees_name', ['firstName', 'lastName'])
export class Employee extends Audit {
  @Column({ name: 'employee_id', unique: true })
  employeeId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'middle_name', nullable: true })
  middleName?: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @ManyToOne(() => JobTitle, { nullable: true })
  @JoinColumn({ name: 'job_title_id' })
  jobTitle?: JobTitle;

  @ManyToOne(() => EmploymentStatus, { nullable: true })
  @JoinColumn({ name: 'employment_status_id' })
  employmentStatus?: EmploymentStatus;

  @ManyToOne(() => SubUnit, { nullable: true })
  @JoinColumn({ name: 'sub_unit_id' })
  subUnit?: SubUnit;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor?: Employee;

  @ManyToOne(() => ReportingMethod, { nullable: true })
  @JoinColumn({ name: 'reporting_method_id' })
  reportingMethod?: ReportingMethod;

  @Column({ name: 'profile_photo_path', nullable: true })
  profilePhotoPath?: string;

  @Column({ name: 'username', nullable: true, unique: true })
  username?: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash?: string;

  @Column({ name: 'login_status', nullable: true, type: 'varchar', length: 20 })
  loginStatus?: 'Enabled' | 'Disabled';

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @OneToMany(() => EmployeeCustomValue, (customValue) => customValue.employee)
  customValues?: EmployeeCustomValue[];
}

