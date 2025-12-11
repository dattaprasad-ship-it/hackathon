import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Employee } from './employee.entity';
import { CustomField } from './custom-field.entity';

@Entity('employee_custom_values')
@Index('idx_employee_custom_values_employee', ['employee'])
@Index('idx_employee_custom_values_field', ['customField'])
@Unique(['employee', 'customField'])
export class EmployeeCustomValue extends Audit {
  @ManyToOne(() => Employee, (employee) => employee.customValues)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => CustomField)
  @JoinColumn({ name: 'custom_field_id' })
  customField: CustomField;

  @Column({ name: 'value', nullable: true })
  value?: string;
}

