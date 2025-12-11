"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PimConfigRepository = void 0;
class PimConfigRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async getConfig() {
        return this.repository.findOne({ where: {} });
    }
    async getOrCreateConfig() {
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
    async updateConfig(config) {
        return this.repository.save(config);
    }
}
exports.PimConfigRepository = PimConfigRepository;
//# sourceMappingURL=pim-config.repository.js.map