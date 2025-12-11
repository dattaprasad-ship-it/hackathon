import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { User } from '../../authentication/entities/user.entity';

@Entity('audit_logs')
@Index('idx_audit_logs_entity_type_id', ['entityType', 'entityId'])
@Index('idx_audit_logs_user_id', ['user'])
@Index('idx_audit_logs_action', ['action'])
@Index('idx_audit_logs_created_at', ['createdAt'])
export class AuditLog extends Audit {
  @Column({ name: 'entity_type', type: 'varchar', length: 50 })
  entityType: string;

  @Column({ name: 'entity_id' })
  entityId: string;

  @Column({ name: 'action', type: 'varchar', length: 20 })
  action: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'old_values', type: 'text', nullable: true })
  oldValues?: string;

  @Column({ name: 'new_values', type: 'text', nullable: true })
  newValues?: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent?: string;
}

