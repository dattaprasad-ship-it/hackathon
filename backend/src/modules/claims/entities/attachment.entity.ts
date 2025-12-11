import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Claim } from './claim.entity';

@Entity('attachments')
@Index('idx_attachments_claim_id', ['claim'])
@Index('idx_attachments_stored_filename', ['storedFilename'])
export class Attachment extends Audit {
  @ManyToOne(() => Claim, (claim) => claim.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @Column({ name: 'original_filename' })
  originalFilename: string;

  @Column({ name: 'stored_filename', unique: true })
  storedFilename: string;

  @Column({ name: 'file_size', type: 'integer' })
  fileSize: number;

  @Column({ name: 'file_type', type: 'varchar', length: 100 })
  fileType: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'file_path' })
  filePath: string;
}

