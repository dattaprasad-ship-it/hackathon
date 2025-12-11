import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Report } from './report.entity';

@Entity('report_display_fields')
@Index('idx_report_display_fields_report', ['report'])
@Index('idx_report_display_fields_order', ['report', 'displayOrder'])
export class ReportDisplayField extends Audit {
  @ManyToOne(() => Report, (report) => report.displayFields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column({ name: 'field_group' })
  fieldGroup: string;

  @Column({ name: 'field_name' })
  fieldName: string;

  @Column({ name: 'include_header', default: false })
  includeHeader: boolean;

  @Column({ name: 'display_order' })
  displayOrder: number;
}

