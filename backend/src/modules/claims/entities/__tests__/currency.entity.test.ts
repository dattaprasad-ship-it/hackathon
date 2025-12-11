import { Currency } from '../currency.entity';

describe('Currency Entity', () => {
  it('should create a currency entity with all required fields', () => {
    const currency = new Currency();
    currency.code = 'USD';
    currency.name = 'US Dollar';
    currency.symbol = '$';
    currency.isActive = true;

    expect(currency.code).toBe('USD');
    expect(currency.name).toBe('US Dollar');
    expect(currency.symbol).toBe('$');
    expect(currency.isActive).toBe(true);
  });

  it('should allow setting Audit base class properties', () => {
    const currency = new Currency();
    currency.id = 'test-id';
    currency.createdAt = new Date();
    currency.updatedAt = new Date();
    
    expect(currency.id).toBe('test-id');
    expect(currency.createdAt).toBeInstanceOf(Date);
    expect(currency.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow setting isActive property', () => {
    const currency = new Currency();
    currency.code = 'EUR';
    currency.name = 'Euro';
    currency.symbol = '€';
    currency.isActive = true;
    expect(currency.isActive).toBe(true);
  });
});

