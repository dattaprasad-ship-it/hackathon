"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PimConfigService = void 0;
class PimConfigService {
    constructor(pimConfigRepository) {
        this.pimConfigRepository = pimConfigRepository;
    }
    async getConfig() {
        const config = await this.pimConfigRepository.getOrCreateConfig();
        return this.mapToResponseDto(config);
    }
    async updateConfig(data, updatedBy) {
        const config = await this.pimConfigRepository.getOrCreateConfig();
        config.showDeprecatedFields = data.showDeprecatedFields;
        config.showSsnField = data.showSsnField;
        config.showSinField = data.showSinField;
        config.showUsTaxExemptions = data.showUsTaxExemptions;
        config.updatedBy = updatedBy;
        const updatedConfig = await this.pimConfigRepository.updateConfig(config);
        return this.mapToResponseDto(updatedConfig);
    }
    mapToResponseDto(config) {
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
exports.PimConfigService = PimConfigService;
//# sourceMappingURL=pim-config.service.js.map