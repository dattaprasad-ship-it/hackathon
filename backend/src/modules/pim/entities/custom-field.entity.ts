import { Entity, Column, OneToMany, Index } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { EmployeeCustomValue } from './employee-custom-value.entity';

@Entity('custom_fields')
@Index('idx_custom_fields_field_name', ['fieldName'])
export class CustomField extends Audit {
  @Column({ name: 'field_name', unique: true })
  fieldName: string;

  @Column({ name: 'screen' })
  screen: string;

  @Column({ name: 'field_type' })
  fieldType: 'Drop Down' | 'Text or Number';

  @Column({ name: 'select_options', nullable: true, type: 'text' })
  selectOptions?: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @OneToMany(() => EmployeeCustomValue, (customValue) => customValue.customField)
  customValues?: EmployeeCustomValue[];
}

