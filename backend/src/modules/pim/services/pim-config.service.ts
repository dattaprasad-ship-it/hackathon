import { PimConfigRepository } from '../repositories/pim-config.repository';
import { PimConfig } from '../entities/pim-config.entity';
import { PimConfigDto, PimConfigResponseDto } from '../dto/pim-config.dto';

export class PimConfigService {
  constructor(private pimConfigRepository: PimConfigRepository) {}

  async getConfig(): Promise<PimConfigResponseDto> {
    const config = await this.pimConfigRepository.getOrCreateConfig();
    return this.mapToResponseDto(config);
  }

  async updateConfig(data: PimConfigDto, updatedBy?: string): Promise<PimConfigResponseDto> {
    const config = await this.pimConfigRepository.getOrCreateConfig();
    config.showDeprecatedFields = data.showDeprecatedFields;
    config.showSsnField = data.showSsnField;
    config.showSinField = data.showSinField;
    config.showUsTaxExemptions = data.showUsTaxExemptions;
    config.updatedBy = updatedBy;

    const updatedConfig = await this.pimConfigRepository.updateConfig(config);
    return this.mapToResponseDto(updatedConfig);
  }

  private mapToResponseDto(config: PimConfig): PimConfigResponseDto {
    return {
      id: config.id,
      showDeprecatedFields: Boolean(config.showDeprecatedFields),
      showSsnField: Boolean(config.showSsnField),
      showSinField: Boolean(config.showSinField),
      showUsTaxExemptions: Boolean(config.showUsTaxExemptions),
      updatedAt: config.updatedAt,
    };
  }
}

