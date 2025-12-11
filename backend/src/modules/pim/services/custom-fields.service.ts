import { CustomFieldRepository } from '../repositories/custom-field.repository';
import { EmployeeCustomValue } from '../entities/employee-custom-value.entity';
import { CustomField } from '../entities/custom-field.entity';
import { BusinessException } from '../../../common/exceptions/business.exception';
import {
  CreateCustomFieldDto,
  UpdateCustomFieldDto,
  CustomFieldResponseDto,
} from '../dto/custom-fields.dto';
import { AppDataSource } from '../../../config/database';

export class CustomFieldsService {
  private readonly MAX_CUSTOM_FIELDS = 10;

  constructor(private customFieldRepository: CustomFieldRepository) {}

  async findAll(): Promise<CustomFieldResponseDto[]> {
    const fields = await this.customFieldRepository.findActiveFields();
    return fields.map((field) => this.mapToResponseDto(field));
  }

  async findOne(id: string): Promise<CustomFieldResponseDto> {
    const field = await this.customFieldRepository.findById(id);
    if (!field || field.isDeleted) {
      throw new BusinessException('Custom field not found', 404, 'CUSTOM_FIELD_NOT_FOUND');
    }
    return this.mapToResponseDto(field);
  }

  async create(data: CreateCustomFieldDto, createdBy?: string): Promise<CustomFieldResponseDto> {
    const activeCount = await this.customFieldRepository.countActiveFields();
    if (activeCount >= this.MAX_CUSTOM_FIELDS) {
      throw new BusinessException(
        `Maximum of ${this.MAX_CUSTOM_FIELDS} custom fields allowed`,
        400,
        'CUSTOM_FIELD_LIMIT_EXCEEDED'
      );
    }

    const existingField = await this.customFieldRepository.findByFieldName(data.fieldName);
    if (existingField && !existingField.isDeleted) {
      throw new BusinessException('Custom field name already exists', 409, 'CUSTOM_FIELD_NAME_CONFLICT');
    }

    if (data.fieldType === 'Drop Down' && !data.selectOptions) {
      throw new BusinessException('Select options are required for Drop Down fields', 400, 'VALIDATION_ERROR');
    }

    const field = new CustomField();
    field.fieldName = data.fieldName;
    field.screen = data.screen;
    field.fieldType = data.fieldType;
    field.selectOptions = data.selectOptions;
    field.isDeleted = false;
    field.createdBy = createdBy;

    const savedField = await this.customFieldRepository.create(field);
    return this.mapToResponseDto(savedField);
  }

  async update(id: string, data: UpdateCustomFieldDto, updatedBy?: string): Promise<CustomFieldResponseDto> {
    const field = await this.customFieldRepository.findById(id);
    if (!field || field.isDeleted) {
      throw new BusinessException('Custom field not found', 404, 'CUSTOM_FIELD_NOT_FOUND');
    }

    if (data.fieldName && data.fieldName !== field.fieldName) {
      const existingField = await this.customFieldRepository.findByFieldName(data.fieldName);
      if (existingField && existingField.id !== id && !existingField.isDeleted) {
        throw new BusinessException('Custom field name already exists', 409, 'CUSTOM_FIELD_NAME_CONFLICT');
      }
      field.fieldName = data.fieldName;
    }

    if (data.screen) field.screen = data.screen;
    if (data.fieldType) {
      field.fieldType = data.fieldType;
      if (data.fieldType === 'Drop Down' && !data.selectOptions && !field.selectOptions) {
        throw new BusinessException('Select options are required for Drop Down fields', 400, 'VALIDATION_ERROR');
      }
    }
    if (data.selectOptions !== undefined) field.selectOptions = data.selectOptions;
    field.updatedBy = updatedBy;

    const updatedField = await this.customFieldRepository.update(id, field);
    return this.mapToResponseDto(updatedField);
  }

  async delete(id: string): Promise<void> {
    const field = await this.customFieldRepository.findById(id);
    if (!field || field.isDeleted) {
      throw new BusinessException('Custom field not found', 404, 'CUSTOM_FIELD_NOT_FOUND');
    }

    const isInUse = await this.isFieldInUse(id);
    if (isInUse) {
      throw new BusinessException('Custom field(s) in use', 400, 'CUSTOM_FIELD_IN_USE');
    }

    await this.customFieldRepository.softDelete(id);
  }

  async getRemainingCount(): Promise<number> {
    const activeCount = await this.customFieldRepository.countActiveFields();
    return Math.max(0, this.MAX_CUSTOM_FIELDS - activeCount);
  }

  private async isFieldInUse(fieldId: string): Promise<boolean> {
    const customValueRepository = AppDataSource.getRepository(EmployeeCustomValue);
    const count = await customValueRepository.count({
      where: { customField: { id: fieldId } } as any,
    });
    return count > 0;
  }

  private mapToResponseDto(field: CustomField): CustomFieldResponseDto {
    return {
      id: field.id,
      fieldName: field.fieldName,
      screen: field.screen,
      fieldType: field.fieldType,
      selectOptions: field.selectOptions,
      isDeleted: field.isDeleted,
      createdAt: field.createdAt,
      updatedAt: field.updatedAt,
    };
  }
}

