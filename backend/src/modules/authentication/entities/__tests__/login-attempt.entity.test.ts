import { LoginAttempt } from '../login-attempt.entity';

describe('LoginAttempt Entity', () => {
  it('should create a login attempt entity with all required fields', () => {
    const attempt = new LoginAttempt();
    attempt.username = 'testuser';
    attempt.ipAddress = '192.168.1.1';
    attempt.success = true;
    attempt.attemptTimestamp = new Date();

    expect(attempt.username).toBe('testuser');
    expect(attempt.ipAddress).toBe('192.168.1.1');
    expect(attempt.success).toBe(true);
    expect(attempt.attemptTimestamp).toBeInstanceOf(Date);
  });

  it('should allow failureReason to be undefined for successful attempts', () => {
    const attempt = new LoginAttempt();
    attempt.username = 'testuser';
    attempt.ipAddress = '192.168.1.1';
    attempt.success = true;
    attempt.attemptTimestamp = new Date();

    expect(attempt.failureReason).toBeUndefined();
  });

  it('should accept failureReason for failed attempts', () => {
    const attempt = new LoginAttempt();
    attempt.username = 'testuser';
    attempt.ipAddress = '192.168.1.1';
    attempt.success = false;
    attempt.failureReason = 'Invalid password';
    attempt.attemptTimestamp = new Date();

    expect(attempt.success).toBe(false);
    expect(attempt.failureReason).toBe('Invalid password');
  });

  it('should extend Audit base class', () => {
    const attempt = new LoginAttempt();
    expect(attempt).toHaveProperty('id');
    expect(attempt).toHaveProperty('createdAt');
    expect(attempt).toHaveProperty('updatedAt');
  });
});

