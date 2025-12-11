export interface CreateCustomFieldDto {
    fieldName: string;
    screen: string;
    fieldType: 'Drop Down' | 'Text or Number';
    selectOptions?: string;
}
export interface UpdateCustomFieldDto {
    fieldName?: string;
    screen?: string;
    fieldType?: 'Drop Down' | 'Text or Number';
    selectOptions?: string;
}
export interface CustomFieldResponseDto {
    id: string;
    fieldName: string;
    screen: string;
    fieldType: 'Drop Down' | 'Text or Number';
    selectOptions?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=custom-fields.dto.d.ts.map