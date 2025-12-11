import { Claim } from '../claim.entity';
import { Employee } from '../../../pim/entities/employee.entity';
import { EventType } from '../event-type.entity';
import { Currency } from '../currency.entity';
import { User } from '../../../authentication/entities/user.entity';
import { Expense } from '../expense.entity';
import { Attachment } from '../attachment.entity';

describe('Claim Entity', () => {
  it('should create a claim entity with all required fields', () => {
    const claim = new Claim();
    const employee = new Employee();
    const eventType = new EventType();
    const currency = new Currency();
    
    claim.referenceId = '202501150000001';
    claim.employee = employee;
    claim.eventType = eventType;
    claim.currency = currency;
    claim.status = 'Initiated';
    claim.totalAmount = 0;

    expect(claim.referenceId).toBe('202501150000001');
    expect(claim.employee).toBe(employee);
    expect(claim.eventType).toBe(eventType);
    expect(claim.currency).toBe(currency);
    expect(claim.status).toBe('Initiated');
    expect(claim.totalAmount).toBe(0);
  });

  it('should allow optional fields to be undefined', () => {
    const claim = new Claim();
    const employee = new Employee();
    const eventType = new EventType();
    const currency = new Currency();
    
    claim.referenceId = '202501150000002';
    claim.employee = employee;
    claim.eventType = eventType;
    claim.currency = currency;
    claim.status = 'Initiated';
    claim.totalAmount = 0;

    expect(claim.remarks).toBeUndefined();
    expect(claim.submittedDate).toBeUndefined();
    expect(claim.approvedDate).toBeUndefined();
    expect(claim.rejectedDate).toBeUndefined();
    expect(claim.rejectionReason).toBeUndefined();
    expect(claim.approver).toBeUndefined();
  });

  it('should accept optional fields', () => {
    const claim = new Claim();
    const employee = new Employee();
    const eventType = new EventType();
    const currency = new Currency();
    const approver = new User();
    
    claim.referenceId = '202501150000003';
    claim.employee = employee;
    claim.eventType = eventType;
    claim.currency = currency;
    claim.status = 'Approved';
    claim.totalAmount = 150.75;
    claim.remarks = 'Business trip to client site';
    claim.submittedDate = new Date('2025-01-16');
    claim.approvedDate = new Date('2025-01-17');
    claim.approver = approver;

    expect(claim.remarks).toBe('Business trip to client site');
    expect(claim.submittedDate).toEqual(new Date('2025-01-16'));
    expect(claim.approvedDate).toEqual(new Date('2025-01-17'));
    expect(claim.approver).toBe(approver);
  });

  it('should handle rejection fields', () => {
    const claim = new Claim();
    const employee = new Employee();
    const eventType = new EventType();
    const currency = new Currency();
    
    claim.referenceId = '202501150000004';
    claim.employee = employee;
    claim.eventType = eventType;
    claim.currency = currency;
    claim.status = 'Rejected';
    claim.totalAmount = 0;
    claim.rejectedDate = new Date('2025-01-18');
    claim.rejectionReason = 'Missing receipts';

    expect(claim.status).toBe('Rejected');
    expect(claim.rejectedDate).toEqual(new Date('2025-01-18'));
    expect(claim.rejectionReason).toBe('Missing receipts');
  });

  it('should allow setting Audit base class properties', () => {
    const claim = new Claim();
    claim.id = 'test-id';
    claim.createdAt = new Date();
    claim.updatedAt = new Date();
    
    expect(claim.id).toBe('test-id');
    expect(claim.createdAt).toBeInstanceOf(Date);
    expect(claim.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow setting totalAmount property', () => {
    const claim = new Claim();
    const employee = new Employee();
    const eventType = new EventType();
    const currency = new Currency();
    
    claim.referenceId = '202501150000005';
    claim.employee = employee;
    claim.eventType = eventType;
    claim.currency = currency;
    claim.status = 'Initiated';
    claim.totalAmount = 0;

    expect(claim.totalAmount).toBe(0);
  });
});

