import { User } from '../user.entity';
import { UserRole } from '../../../../constants/enums/user-role.enum';
import { AccountStatus } from '../../../../constants/enums/account-status.enum';

describe('User Entity', () => {
  it('should create a user entity with all required fields', () => {
    const user = new User();
    user.username = 'testuser';
    user.passwordHash = 'hashed_password';
    user.role = UserRole.ADMIN;
    user.accountStatus = AccountStatus.ACTIVE;

    expect(user.username).toBe('testuser');
    expect(user.passwordHash).toBe('hashed_password');
    expect(user.role).toBe(UserRole.ADMIN);
    expect(user.accountStatus).toBe(AccountStatus.ACTIVE);
  });

  it('should allow optional fields to be undefined', () => {
    const user = new User();
    user.username = 'testuser';
    user.passwordHash = 'hashed_password';
    user.role = UserRole.EMPLOYEE;
    user.accountStatus = AccountStatus.ACTIVE;

    expect(user.displayName).toBeUndefined();
    expect(user.email).toBeUndefined();
    expect(user.lastLoginAt).toBeUndefined();
  });

  it('should accept optional fields', () => {
    const user = new User();
    user.username = 'testuser';
    user.passwordHash = 'hashed_password';
    user.role = UserRole.ADMIN;
    user.accountStatus = AccountStatus.ACTIVE;
    user.displayName = 'Test User';
    user.email = 'test@example.com';
    user.lastLoginAt = new Date();

    expect(user.displayName).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.lastLoginAt).toBeInstanceOf(Date);
  });

  it('should extend Audit base class', () => {
    const user = new User();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });
});

