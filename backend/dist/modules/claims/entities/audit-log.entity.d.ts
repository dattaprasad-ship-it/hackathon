import { Audit } from '../../../common/base/audit.entity';
import { User } from '../../authentication/entities/user.entity';
export declare class AuditLog extends Audit {
    entityType: string;
    entityId: string;
    action: string;
    user: User;
    oldValues?: string;
    newValues?: string;
    ipAddress?: string;
    userAgent?: string;
}
//# sourceMappingURL=audit-log.entity.d.ts.map