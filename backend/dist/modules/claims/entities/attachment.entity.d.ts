import { Audit } from '../../../common/base/audit.entity';
import { Claim } from './claim.entity';
export declare class Attachment extends Audit {
    claim: Claim;
    originalFilename: string;
    storedFilename: string;
    fileSize: number;
    fileType: string;
    description?: string;
    filePath: string;
}
//# sourceMappingURL=attachment.entity.d.ts.map