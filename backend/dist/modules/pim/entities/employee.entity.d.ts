import { Audit } from '../../../common/base/audit.entity';
import { JobTitle } from './job-title.entity';
import { EmploymentStatus } from './employment-status.entity';
import { SubUnit } from './sub-unit.entity';
import { ReportingMethod } from './reporting-method.entity';
import { EmployeeCustomValue } from './employee-custom-value.entity';
export declare class Employee extends Audit {
    employeeId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    jobTitle?: JobTitle;
    employmentStatus?: EmploymentStatus;
    subUnit?: SubUnit;
    supervisor?: Employee;
    reportingMethod?: ReportingMethod;
    profilePhotoPath?: string;
    username?: string;
    passwordHash?: string;
    loginStatus?: 'Enabled' | 'Disabled';
    isDeleted: boolean;
    customValues?: EmployeeCustomValue[];
}
//# sourceMappingURL=employee.entity.d.ts.map