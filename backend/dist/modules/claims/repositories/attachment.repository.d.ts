import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Attachment } from '../entities/attachment.entity';
export declare class AttachmentRepository extends IGenericRepository<Attachment> {
    constructor(repository: Repository<Attachment>);
    findByClaimId(claimId: string): Promise<Attachment[]>;
    findByStoredFilename(storedFilename: string): Promise<Attachment | null>;
}
//# sourceMappingURL=attachment.repository.d.ts.map