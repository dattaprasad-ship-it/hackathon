export interface PimConfig {
  id: string;
  showDeprecatedFields: boolean;
  showSsnField: boolean;
  showSinField: boolean;
  showUsTaxExemptions: boolean;
  updatedAt: Date;
}

export interface UpdatePimConfigRequest {
  showDeprecatedFields: boolean;
  showSsnField: boolean;
  showSinField: boolean;
  showUsTaxExemptions: boolean;
}

