import { Audit } from '../../../common/base/audit.entity';
import { ReportSelectionCriteria } from './report-selection-criteria.entity';
import { ReportDisplayField } from './report-display-field.entity';
export declare class Report extends Audit {
    reportName: string;
    isPredefined: boolean;
    selectionCriteria?: ReportSelectionCriteria[];
    displayFields?: ReportDisplayField[];
}
//# sourceMappingURL=report.entity.d.ts.map