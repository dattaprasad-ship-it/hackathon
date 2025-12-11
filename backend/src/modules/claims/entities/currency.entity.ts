import { Entity, Column, Index } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';

@Entity('currencies')
@Index('idx_currencies_code', ['code'])
@Index('idx_currencies_is_active', ['isActive'])
export class Currency extends Audit {
  @Column({ name: 'code', unique: true, length: 3 })
  code: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'symbol', length: 10 })
  symbol: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}

