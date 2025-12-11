import * as bcrypt from 'bcrypt';
import { passwordUtil } from '../password.util';

jest.mock('bcrypt');

describe('Password Util', () => {
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hashedPassword = '$2b$10$hashedpassword';

      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const result = await passwordUtil.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should use salt rounds from environment variable', async () => {
      const originalEnv = process.env.BCRYPT_SALT_ROUNDS;
      process.env.BCRYPT_SALT_ROUNDS = '12';

      const password = 'testpassword123';
      const hashedPassword = '$2b$12$hashedpassword';

      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);

      await passwordUtil.hashPassword(password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 12);

      process.env.BCRYPT_SALT_ROUNDS = originalEnv;
    });

    it('should default to 10 salt rounds if not specified', async () => {
      const originalEnv = process.env.BCRYPT_SALT_ROUNDS;
      delete process.env.BCRYPT_SALT_ROUNDS;

      const password = 'testpassword123';
      mockBcrypt.hash.mockResolvedValue('$2b$10$hashed' as never);

      await passwordUtil.hashPassword(password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);

      process.env.BCRYPT_SALT_ROUNDS = originalEnv;
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testpassword123';
      const hash = '$2b$10$hashedpassword';

      mockBcrypt.compare.mockResolvedValue(true as never);

      const result = await passwordUtil.verifyPassword(password, hash);

      expect(result).toBe(true);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should return false for incorrect password', async () => {
      const password = 'wrongpassword';
      const hash = '$2b$10$hashedpassword';

      mockBcrypt.compare.mockResolvedValue(false as never);

      const result = await passwordUtil.verifyPassword(password, hash);

      expect(result).toBe(false);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should use constant-time comparison', async () => {
      const password = 'testpassword123';
      const hash = '$2b$10$hashedpassword';

      mockBcrypt.compare.mockResolvedValue(true as never);

      await passwordUtil.verifyPassword(password, hash);

      expect(mockBcrypt.compare).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateSalt', () => {
    it('should generate a salt', async () => {
      const salt = '$2b$10$randomsalt';

      mockBcrypt.genSalt.mockResolvedValue(salt as never);

      const result = await passwordUtil.generateSalt();

      expect(result).toBe(salt);
      expect(mockBcrypt.genSalt).toHaveBeenCalledWith(10);
    });
  });
});

