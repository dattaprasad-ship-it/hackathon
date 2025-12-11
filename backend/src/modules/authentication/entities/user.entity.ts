import { Entity, Column, Index } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { UserRole } from '../../../constants/enums/user-role.enum';
import { AccountStatus } from '../../../constants/enums/account-status.enum';

@Entity('users')
@Index('idx_users_username', ['username'])
export class User extends Audit {
  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'role', type: 'varchar', length: 20 })
  role: UserRole;

  @Column({ name: 'account_status', type: 'varchar', length: 20 })
  accountStatus: AccountStatus;

  @Column({ name: 'display_name', nullable: true })
  displayName?: string;

  @Column({ name: 'email', nullable: true })
  email?: string;

  @Column({ name: 'last_login_at', nullable: true, type: 'datetime' })
  lastLoginAt?: Date;
}

