import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { CustomField } from '../entities/custom-field.entity';
export declare class CustomFieldRepository extends IGenericRepository<CustomField> {
    constructor(repository: Repository<CustomField>);
    findByFieldName(fieldName: string): Promise<CustomField | null>;
    findActiveFields(): Promise<CustomField[]>;
    countActiveFields(): Promise<number>;
    findByScreen(screen: string): Promise<CustomField[]>;
    softDelete(id: string, updatedBy?: string): Promise<void>;
}
//# sourceMappingURL=custom-field.repository.d.ts.map