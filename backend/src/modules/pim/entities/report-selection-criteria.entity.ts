import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Report } from './report.entity';

@Entity('report_selection_criteria')
@Index('idx_report_criteria_report', ['report'])
export class ReportSelectionCriteria extends Audit {
  @ManyToOne(() => Report, (report) => report.selectionCriteria, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column({ name: 'criteria_type' })
  criteriaType: string;

  @Column({ name: 'criteria_value' })
  criteriaValue: string;

  @Column({ name: 'include_option', nullable: true })
  includeOption?: string;
}

