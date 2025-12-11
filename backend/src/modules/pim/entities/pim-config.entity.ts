import { Entity, Column } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';

@Entity('pim_config')
export class PimConfig extends Audit {
  @Column({ name: 'show_deprecated_fields', type: 'integer', default: 0 })
  showDeprecatedFields: boolean;

  @Column({ name: 'show_ssn_field', type: 'integer', default: 0 })
  showSsnField: boolean;

  @Column({ name: 'show_sin_field', type: 'integer', default: 0 })
  showSinField: boolean;

  @Column({ name: 'show_us_tax_exemptions', type: 'integer', default: 0 })
  showUsTaxExemptions: boolean;
}

