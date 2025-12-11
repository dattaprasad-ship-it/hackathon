import { Repository } from 'typeorm';
import { PimConfig } from '../entities/pim-config.entity';
export declare class PimConfigRepository {
    private repository;
    constructor(repository: Repository<PimConfig>);
    getConfig(): Promise<PimConfig | null>;
    getOrCreateConfig(): Promise<PimConfig>;
    updateConfig(config: PimConfig): Promise<PimConfig>;
}
//# sourceMappingURL=pim-config.repository.d.ts.map