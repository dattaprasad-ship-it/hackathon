import { Audit } from '../../../common/base/audit.entity';
import { Employee } from './employee.entity';
export declare class SubUnit extends Audit {
    name: string;
    parent?: SubUnit;
    employees?: Employee[];
}
//# sourceMappingURL=sub-unit.entity.d.ts.map