import { EventTypeRepository } from '../repositories/event-type.repository';
import { ExpenseTypeRepository } from '../repositories/expense-type.repository';
import { CurrencyRepository } from '../repositories/currency.repository';
import { EventType } from '../entities/event-type.entity';
import { ExpenseType } from '../entities/expense-type.entity';
import { Currency } from '../entities/currency.entity';
export declare class ClaimsConfigService {
    private readonly eventTypeRepository;
    private readonly expenseTypeRepository;
    private readonly currencyRepository;
    constructor(eventTypeRepository: EventTypeRepository, expenseTypeRepository: ExpenseTypeRepository, currencyRepository: CurrencyRepository);
    getConfig(): Promise<{
        eventTypes: EventType[];
        expenseTypes: ExpenseType[];
        currencies: Currency[];
    }>;
}
//# sourceMappingURL=claims-config.service.d.ts.map