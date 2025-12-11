import { CustomFieldRepository } from '../repositories/custom-field.repository';
import { CreateCustomFieldDto, UpdateCustomFieldDto, CustomFieldResponseDto } from '../dto/custom-fields.dto';
export declare class CustomFieldsService {
    private customFieldRepository;
    private readonly MAX_CUSTOM_FIELDS;
    constructor(customFieldRepository: CustomFieldRepository);
    findAll(): Promise<CustomFieldResponseDto[]>;
    findOne(id: string): Promise<CustomFieldResponseDto>;
    create(data: CreateCustomFieldDto, createdBy?: string): Promise<CustomFieldResponseDto>;
    update(id: string, data: UpdateCustomFieldDto, updatedBy?: string): Promise<CustomFieldResponseDto>;
    delete(id: string): Promise<void>;
    getRemainingCount(): Promise<number>;
    private isFieldInUse;
    private mapToResponseDto;
}
//# sourceMappingURL=custom-fields.service.d.ts.map