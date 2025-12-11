import { Audit } from '../../../common/base/audit.entity';
import { UserRole } from '../../../constants/enums/user-role.enum';
import { AccountStatus } from '../../../constants/enums/account-status.enum';
export declare class User extends Audit {
    username: string;
    passwordHash: string;
    role: UserRole;
    accountStatus: AccountStatus;
    displayName?: string;
    email?: string;
    lastLoginAt?: Date;
}
//# sourceMappingURL=user.entity.d.ts.map