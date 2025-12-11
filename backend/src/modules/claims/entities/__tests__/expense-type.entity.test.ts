import { ExpenseType } from '../expense-type.entity';

describe('ExpenseType Entity', () => {
  it('should create an expense type entity with all required fields', () => {
    const expenseType = new ExpenseType();
    expenseType.name = 'Travel Expenses';
    expenseType.description = 'Travel related expenses';
    expenseType.isActive = true;

    expect(expenseType.name).toBe('Travel Expenses');
    expect(expenseType.description).toBe('Travel related expenses');
    expect(expenseType.isActive).toBe(true);
  });

  it('should allow optional description to be undefined', () => {
    const expenseType = new ExpenseType();
    expenseType.name = 'Accommodation';
    expenseType.isActive = true;

    expect(expenseType.description).toBeUndefined();
  });

  it('should allow setting Audit base class properties', () => {
    const expenseType = new ExpenseType();
    expenseType.id = 'test-id';
    expenseType.createdAt = new Date();
    expenseType.updatedAt = new Date();
    
    expect(expenseType.id).toBe('test-id');
    expect(expenseType.createdAt).toBeInstanceOf(Date);
    expect(expenseType.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow setting isActive property', () => {
    const expenseType = new ExpenseType();
    expenseType.name = 'Test Expense Type';
    expenseType.isActive = true;
    expect(expenseType.isActive).toBe(true);
  });
});

