import { Entity, Column, Index } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';

@Entity('event_types')
@Index('idx_event_types_name', ['name'])
@Index('idx_event_types_is_active', ['isActive'])
export class EventType extends Audit {
  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}

