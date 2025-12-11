import { PimConfigRepository } from '../repositories/pim-config.repository';
import { PimConfigDto, PimConfigResponseDto } from '../dto/pim-config.dto';
export declare class PimConfigService {
    private pimConfigRepository;
    constructor(pimConfigRepository: PimConfigRepository);
    getConfig(): Promise<PimConfigResponseDto>;
    updateConfig(data: PimConfigDto, updatedBy?: string): Promise<PimConfigResponseDto>;
    private mapToResponseDto;
}
//# sourceMappingURL=pim-config.service.d.ts.map