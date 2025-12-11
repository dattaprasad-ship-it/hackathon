import { EventTypeRepository } from '../repositories/event-type.repository';
import { ExpenseTypeRepository } from '../repositories/expense-type.repository';
import { CurrencyRepository } from '../repositories/currency.repository';
import { EventType } from '../entities/event-type.entity';
import { ExpenseType } from '../entities/expense-type.entity';
import { Currency } from '../entities/currency.entity';
import { BusinessException } from '../../../common/exceptions/business.exception';
import { ClaimsConfigCacheService } from './claims-config-cache.service';

export class ClaimsConfigService {
  private cacheService: ClaimsConfigCacheService;

  constructor(
    private readonly eventTypeRepository: EventTypeRepository,
    private readonly expenseTypeRepository: ExpenseTypeRepository,
    private readonly currencyRepository: CurrencyRepository
  ) {
    this.cacheService = new ClaimsConfigCacheService(
      eventTypeRepository,
      expenseTypeRepository,
      currencyRepository
    );
  }

  async getConfig(): Promise<{
    eventTypes: EventType[];
    expenseTypes: ExpenseType[];
    currencies: Currency[];
  }> {
    return this.cacheService.getConfig();
  }

  invalidateCache(): void {
    this.cacheService.invalidateCache();
  }
}

