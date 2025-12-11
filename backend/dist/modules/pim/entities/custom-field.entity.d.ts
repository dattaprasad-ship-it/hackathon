import { Audit } from '../../../common/base/audit.entity';
import { EmployeeCustomValue } from './employee-custom-value.entity';
export declare class CustomField extends Audit {
    fieldName: string;
    screen: string;
    fieldType: 'Drop Down' | 'Text or Number';
    selectOptions?: string;
    isDeleted: boolean;
    customValues?: EmployeeCustomValue[];
}
//# sourceMappingURL=custom-field.entity.d.ts.map