import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Attachment } from '../entities/attachment.entity';

export class AttachmentRepository extends IGenericRepository<Attachment> {
  constructor(repository: Repository<Attachment>) {
    super(repository);
  }

  async findByClaimId(claimId: string): Promise<Attachment[]> {
    return this.repository.find({
      where: { claim: { id: claimId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStoredFilename(storedFilename: string): Promise<Attachment | null> {
    return this.repository.findOne({
      where: { storedFilename },
      relations: ['claim'],
    });
  }
}

