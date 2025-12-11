import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Currency } from '../entities/currency.entity';

export class CurrencyRepository extends IGenericRepository<Currency> {
  constructor(repository: Repository<Currency>) {
    super(repository);
  }

  async findActive(): Promise<Currency[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { code: 'ASC' },
    });
  }

  async findByCode(code: string): Promise<Currency | null> {
    return this.repository.findOne({
      where: { code },
    });
  }
}

