"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimsConfigService = void 0;
class ClaimsConfigService {
    constructor(eventTypeRepository, expenseTypeRepository, currencyRepository) {
        this.eventTypeRepository = eventTypeRepository;
        this.expenseTypeRepository = expenseTypeRepository;
        this.currencyRepository = currencyRepository;
    }
    async getConfig() {
        const [eventTypes, expenseTypes, currencies] = await Promise.all([
            this.eventTypeRepository.findActive(),
            this.expenseTypeRepository.findActive(),
            this.currencyRepository.findActive(),
        ]);
        return {
            eventTypes,
            expenseTypes,
            currencies,
        };
    }
}
exports.ClaimsConfigService = ClaimsConfigService;
//# sourceMappingURL=claims-config.service.js.map