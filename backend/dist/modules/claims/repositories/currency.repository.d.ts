import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Currency } from '../entities/currency.entity';
export declare class CurrencyRepository extends IGenericRepository<Currency> {
    constructor(repository: Repository<Currency>);
    findActive(): Promise<Currency[]>;
    findByCode(code: string): Promise<Currency | null>;
}
//# sourceMappingURL=currency.repository.d.ts.map