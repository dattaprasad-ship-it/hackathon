import { EventTypeRepository } from '../repositories/event-type.repository';
import { ExpenseTypeRepository } from '../repositories/expense-type.repository';
import { CurrencyRepository } from '../repositories/currency.repository';
import { EventType } from '../entities/event-type.entity';
import { ExpenseType } from '../entities/expense-type.entity';
import { Currency } from '../entities/currency.entity';
import { logger } from '../../../utils/logger';

interface CachedConfig {
  eventTypes: EventType[];
  expenseTypes: ExpenseType[];
  currencies: Currency[];
  timestamp: number;
}

export class ClaimsConfigCacheService {
  private cache: CachedConfig | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly cacheKey = 'claims-config';

  constructor(
    private readonly eventTypeRepository: EventTypeRepository,
    private readonly expenseTypeRepository: ExpenseTypeRepository,
    private readonly currencyRepository: CurrencyRepository
  ) {}

  async getConfig(): Promise<{
    eventTypes: EventType[];
    expenseTypes: ExpenseType[];
    currencies: Currency[];
  }> {
    // Check if cache is valid
    if (this.cache && this.isCacheValid()) {
      logger.debug('Returning cached claims configuration');
      return {
        eventTypes: this.cache.eventTypes,
        expenseTypes: this.cache.expenseTypes,
        currencies: this.cache.currencies,
      };
    }

    // Fetch fresh data
    logger.debug('Fetching fresh claims configuration');
    const [eventTypes, expenseTypes, currencies] = await Promise.all([
      this.eventTypeRepository.findActive(),
      this.expenseTypeRepository.findActive(),
      this.currencyRepository.findActive(),
    ]);

    // Update cache
    this.cache = {
      eventTypes,
      expenseTypes,
      currencies,
      timestamp: Date.now(),
    };

    return {
      eventTypes,
      expenseTypes,
      currencies,
    };
  }

  invalidateCache(): void {
    logger.debug('Invalidating claims configuration cache');
    this.cache = null;
  }

  private isCacheValid(): boolean {
    if (!this.cache) {
      return false;
    }

    const age = Date.now() - this.cache.timestamp;
    return age < this.CACHE_TTL;
  }
}

