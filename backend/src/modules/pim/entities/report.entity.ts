import { Entity, Column, OneToMany, Index } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { ReportSelectionCriteria } from './report-selection-criteria.entity';
import { ReportDisplayField } from './report-display-field.entity';

@Entity('reports')
@Index('idx_reports_report_name', ['reportName'])
export class Report extends Audit {
  @Column({ name: 'report_name', unique: true })
  reportName: string;

  @Column({ name: 'is_predefined', default: false })
  isPredefined: boolean;

  @OneToMany(() => ReportSelectionCriteria, (criteria) => criteria.report, { cascade: true })
  selectionCriteria?: ReportSelectionCriteria[];

  @OneToMany(() => ReportDisplayField, (field) => field.report, { cascade: true })
  displayFields?: ReportDisplayField[];
}

