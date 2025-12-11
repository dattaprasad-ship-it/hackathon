import { Repository } from 'typeorm';
import { PimConfig } from '../entities/pim-config.entity';

export class PimConfigRepository {
  constructor(private repository: Repository<PimConfig>) {}

  async getConfig(): Promise<PimConfig | null> {
    return this.repository.findOne({ where: {} });
  }

  async getOrCreateConfig(): Promise<PimConfig> {
    let config = await this.getConfig();
    if (!config) {
      config = this.repository.create({
        showDeprecatedFields: false,
        showSsnField: false,
        showSinField: false,
        showUsTaxExemptions: false,
      });
      config = await this.repository.save(config);
    }
    return config;
  }

  async updateConfig(config: PimConfig): Promise<PimConfig> {
    return this.repository.save(config);
  }
}

