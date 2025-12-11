import { Repository } from 'typeorm';
import { CurrencyRepository } from '../currency.repository';
import { Currency } from '../../entities/currency.entity';
import { when } from 'jest-when';

describe('CurrencyRepository', () => {
  let repository: CurrencyRepository;
  let mockRepository: jest.Mocked<Repository<Currency>>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as any;

    repository = new CurrencyRepository(mockRepository);
  });

  describe('findActive', () => {
    it('should find all active currencies', async () => {
      const mockCurrencies = [
        { id: '1', code: 'USD', name: 'US Dollar', symbol: '$', isActive: true } as Currency,
        { id: '2', code: 'EUR', name: 'Euro', symbol: '€', isActive: true } as Currency,
      ];

      when(mockRepository.find).calledWith({
        where: { isActive: true },
        order: { code: 'ASC' },
      }).mockResolvedValue(mockCurrencies);

      const result = await repository.findActive();

      expect(result).toEqual(mockCurrencies);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { code: 'ASC' },
      });
    });
  });

  describe('findByCode', () => {
    it('should find currency by code', async () => {
      const mockCurrency = {
        id: '1',
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        isActive: true,
      } as Currency;

      when(mockRepository.findOne).calledWith({
        where: { code: 'USD' },
      }).mockResolvedValue(mockCurrency);

      const result = await repository.findByCode('USD');

      expect(result).toEqual(mockCurrency);
    });
  });
});

