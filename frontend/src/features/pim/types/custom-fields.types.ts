export interface CustomField {
  id: string;
  fieldName: string;
  screen: string;
  fieldType: 'Drop Down' | 'Text or Number';
  selectOptions?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomFieldRequest {
  fieldName: string;
  screen: string;
  fieldType: 'Drop Down' | 'Text or Number';
  selectOptions?: string;
}

export interface UpdateCustomFieldRequest {
  fieldName?: string;
  screen?: string;
  fieldType?: 'Drop Down' | 'Text or Number';
  selectOptions?: string;
}

export interface CustomFieldsListResponse {
  data: CustomField[];
  remaining: number;
}

