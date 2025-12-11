import { EventType } from '../event-type.entity';

describe('EventType Entity', () => {
  it('should create an event type entity with all required fields', () => {
    const eventType = new EventType();
    eventType.name = 'Travel Allowance';
    eventType.description = 'Travel expense claims';
    eventType.isActive = true;

    expect(eventType.name).toBe('Travel Allowance');
    expect(eventType.description).toBe('Travel expense claims');
    expect(eventType.isActive).toBe(true);
  });

  it('should allow optional description to be undefined', () => {
    const eventType = new EventType();
    eventType.name = 'Medical Reimbursement';
    eventType.isActive = true;

    expect(eventType.description).toBeUndefined();
  });

  it('should allow setting Audit base class properties', () => {
    const eventType = new EventType();
    eventType.id = 'test-id';
    eventType.createdAt = new Date();
    eventType.updatedAt = new Date();
    
    expect(eventType.id).toBe('test-id');
    expect(eventType.createdAt).toBeInstanceOf(Date);
    expect(eventType.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow setting isActive property', () => {
    const eventType = new EventType();
    eventType.name = 'Test Event';
    eventType.isActive = true;
    expect(eventType.isActive).toBe(true);
  });
});

