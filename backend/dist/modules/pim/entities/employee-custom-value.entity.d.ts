import { Audit } from '../../../common/base/audit.entity';
import { Employee } from './employee.entity';
import { CustomField } from './custom-field.entity';
export declare class EmployeeCustomValue extends Audit {
    employee: Employee;
    customField: CustomField;
    value?: string;
}
//# sourceMappingURL=employee-custom-value.entity.d.ts.map