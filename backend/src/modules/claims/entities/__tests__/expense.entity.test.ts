import { Expense } from '../expense.entity';
import { Claim } from '../claim.entity';
import { ExpenseType } from '../expense-type.entity';

describe('Expense Entity', () => {
  it('should create an expense entity with all required fields', () => {
    const expense = new Expense();
    const claim = new Claim();
    const expenseType = new ExpenseType();
    
    expense.claim = claim;
    expense.expenseType = expenseType;
    expense.expenseDate = new Date('2025-01-15');
    expense.amount = 100.50;

    expect(expense.claim).toBe(claim);
    expect(expense.expenseType).toBe(expenseType);
    expect(expense.expenseDate).toEqual(new Date('2025-01-15'));
    expect(expense.amount).toBe(100.50);
  });

  it('should allow optional note to be undefined', () => {
    const expense = new Expense();
    const claim = new Claim();
    const expenseType = new ExpenseType();
    
    expense.claim = claim;
    expense.expenseType = expenseType;
    expense.expenseDate = new Date();
    expense.amount = 50.00;

    expect(expense.note).toBeUndefined();
  });

  it('should accept optional note', () => {
    const expense = new Expense();
    const claim = new Claim();
    const expenseType = new ExpenseType();
    
    expense.claim = claim;
    expense.expenseType = expenseType;
    expense.expenseDate = new Date();
    expense.amount = 75.25;
    expense.note = 'Taxi fare to airport';

    expect(expense.note).toBe('Taxi fare to airport');
  });

  it('should allow setting Audit base class properties', () => {
    const expense = new Expense();
    expense.id = 'test-id';
    expense.createdAt = new Date();
    expense.updatedAt = new Date();
    
    expect(expense.id).toBe('test-id');
    expect(expense.createdAt).toBeInstanceOf(Date);
    expect(expense.updatedAt).toBeInstanceOf(Date);
  });
});

