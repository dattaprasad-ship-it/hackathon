import { Entity, Column, Index } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';

@Entity('login_attempts')
@Index('idx_login_attempts_ip_timestamp', ['ipAddress', 'attemptTimestamp'])
@Index('idx_login_attempts_username_timestamp', ['username', 'attemptTimestamp'])
export class LoginAttempt extends Audit {
  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'success' })
  success: boolean;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason?: string;

  @Column({ name: 'attempt_timestamp', type: 'datetime' })
  attemptTimestamp: Date;
}

