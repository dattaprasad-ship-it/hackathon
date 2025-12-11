import { AuditLog } from '../audit-log.entity';
import { User } from '../../../authentication/entities/user.entity';

describe('AuditLog Entity', () => {
  it('should create an audit log entity with all required fields', () => {
    const auditLog = new AuditLog();
    const user = new User();
    
    auditLog.entityType = 'Claim';
    auditLog.entityId = 'claim-123';
    auditLog.action = 'CREATE';
    auditLog.user = user;
    auditLog.oldValues = JSON.stringify({ status: 'Initiated' });
    auditLog.newValues = JSON.stringify({ status: 'Submitted' });

    expect(auditLog.entityType).toBe('Claim');
    expect(auditLog.entityId).toBe('claim-123');
    expect(auditLog.action).toBe('CREATE');
    expect(auditLog.user).toBe(user);
    expect(auditLog.oldValues).toBe(JSON.stringify({ status: 'Initiated' }));
    expect(auditLog.newValues).toBe(JSON.stringify({ status: 'Submitted' }));
  });

  it('should allow optional fields to be undefined', () => {
    const auditLog = new AuditLog();
    const user = new User();
    
    auditLog.entityType = 'Expense';
    auditLog.entityId = 'expense-456';
    auditLog.action = 'DELETE';
    auditLog.user = user;

    expect(auditLog.oldValues).toBeUndefined();
    expect(auditLog.newValues).toBeUndefined();
    expect(auditLog.ipAddress).toBeUndefined();
    expect(auditLog.userAgent).toBeUndefined();
  });

  it('should accept optional fields', () => {
    const auditLog = new AuditLog();
    const user = new User();
    
    auditLog.entityType = 'Claim';
    auditLog.entityId = 'claim-789';
    auditLog.action = 'APPROVE';
    auditLog.user = user;
    auditLog.ipAddress = '192.168.1.1';
    auditLog.userAgent = 'Mozilla/5.0';

    expect(auditLog.ipAddress).toBe('192.168.1.1');
    expect(auditLog.userAgent).toBe('Mozilla/5.0');
  });

  it('should allow setting Audit base class properties', () => {
    const auditLog = new AuditLog();
    auditLog.id = 'test-id';
    auditLog.createdAt = new Date();
    auditLog.updatedAt = new Date();
    
    expect(auditLog.id).toBe('test-id');
    expect(auditLog.createdAt).toBeInstanceOf(Date);
    expect(auditLog.updatedAt).toBeInstanceOf(Date);
  });
});

