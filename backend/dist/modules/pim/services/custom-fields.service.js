"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFieldsService = void 0;
const employee_custom_value_entity_1 = require("../entities/employee-custom-value.entity");
const custom_field_entity_1 = require("../entities/custom-field.entity");
const business_exception_1 = require("../../../common/exceptions/business.exception");
const database_1 = require("../../../config/database");
class CustomFieldsService {
    constructor(customFieldRepository) {
        this.customFieldRepository = customFieldRepository;
        this.MAX_CUSTOM_FIELDS = 10;
    }
    async findAll() {
        const fields = await this.customFieldRepository.findActiveFields();
        return fields.map((field) => this.mapToResponseDto(field));
    }
    async findOne(id) {
        const field = await this.customFieldRepository.findById(id);
        if (!field || field.isDeleted) {
            throw new business_exception_1.BusinessException('Custom field not found', 404, 'CUSTOM_FIELD_NOT_FOUND');
        }
        return this.mapToResponseDto(field);
    }
    async create(data, createdBy) {
        const activeCount = await this.customFieldRepository.countActiveFields();
        if (activeCount >= this.MAX_CUSTOM_FIELDS) {
            throw new business_exception_1.BusinessException(`Maximum of ${this.MAX_CUSTOM_FIELDS} custom fields allowed`, 400, 'CUSTOM_FIELD_LIMIT_EXCEEDED');
        }
        const existingField = await this.customFieldRepository.findByFieldName(data.fieldName);
        if (existingField && !existingField.isDeleted) {
            throw new business_exception_1.BusinessException('Custom field name already exists', 409, 'CUSTOM_FIELD_NAME_CONFLICT');
        }
        if (data.fieldType === 'Drop Down' && !data.selectOptions) {
            throw new business_exception_1.BusinessException('Select options are required for Drop Down fields', 400, 'VALIDATION_ERROR');
        }
        const field = new custom_field_entity_1.CustomField();
        field.fieldName = data.fieldName;
        field.screen = data.screen;
        field.fieldType = data.fieldType;
        field.selectOptions = data.selectOptions;
        field.isDeleted = false;
        field.createdBy = createdBy;
        const savedField = await this.customFieldRepository.create(field);
        return this.mapToResponseDto(savedField);
    }
    async update(id, data, updatedBy) {
        const field = await this.customFieldRepository.findById(id);
        if (!field || field.isDeleted) {
            throw new business_exception_1.BusinessException('Custom field not found', 404, 'CUSTOM_FIELD_NOT_FOUND');
        }
        if (data.fieldName && data.fieldName !== field.fieldName) {
            const existingField = await this.customFieldRepository.findByFieldName(data.fieldName);
            if (existingField && existingField.id !== id && !existingField.isDeleted) {
                throw new business_exception_1.BusinessException('Custom field name already exists', 409, 'CUSTOM_FIELD_NAME_CONFLICT');
            }
            field.fieldName = data.fieldName;
        }
        if (data.screen)
            field.screen = data.screen;
        if (data.fieldType) {
            field.fieldType = data.fieldType;
            if (data.fieldType === 'Drop Down' && !data.selectOptions && !field.selectOptions) {
                throw new business_exception_1.BusinessException('Select options are required for Drop Down fields', 400, 'VALIDATION_ERROR');
            }
        }
        if (data.selectOptions !== undefined)
            field.selectOptions = data.selectOptions;
        field.updatedBy = updatedBy;
        const updatedField = await this.customFieldRepository.update(id, field);
        return this.mapToResponseDto(updatedField);
    }
    async delete(id) {
        const field = await this.customFieldRepository.findById(id);
        if (!field || field.isDeleted) {
            throw new business_exception_1.BusinessException('Custom field not found', 404, 'CUSTOM_FIELD_NOT_FOUND');
        }
        const isInUse = await this.isFieldInUse(id);
        if (isInUse) {
            throw new business_exception_1.BusinessException('Custom field(s) in use', 400, 'CUSTOM_FIELD_IN_USE');
        }
        await this.customFieldRepository.softDelete(id);
    }
    async getRemainingCount() {
        const activeCount = await this.customFieldRepository.countActiveFields();
        return Math.max(0, this.MAX_CUSTOM_FIELDS - activeCount);
    }
    async isFieldInUse(fieldId) {
        const customValueRepository = database_1.AppDataSource.getRepository(employee_custom_value_entity_1.EmployeeCustomValue);
        const count = await customValueRepository.count({
            where: { customField: { id: fieldId } },
        });
        return count > 0;
    }
    mapToResponseDto(field) {
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
exports.CustomFieldsService = CustomFieldsService;
//# sourceMappingURL=custom-fields.service.js.map