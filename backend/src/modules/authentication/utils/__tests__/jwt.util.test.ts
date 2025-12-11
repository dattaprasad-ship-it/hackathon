import * as jwt from 'jsonwebtoken';
import { jwtUtil, JwtPayload } from '../jwt.util';

jest.mock('jsonwebtoken');

describe('JWT Util', () => {
  const mockJwt = jwt as jest.Mocked<typeof jwt>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const payload = {
        id: '1',
        username: 'testuser',
        role: 'Admin',
      };

      const token = 'generated.jwt.token';

      mockJwt.sign.mockReturnValue(token);

      const result = jwtUtil.generateToken(payload);

      expect(result).toBe(token);
      expect(mockJwt.sign).toHaveBeenCalledWith(
        payload,
        process.env.JWT_SECRET || 'default-secret-change-in-production',
        {
          expiresIn: process.env.JWT_EXPIRATION || '24h',
        }
      );
    });

    it('should use environment variable for secret', () => {
      const originalEnv = process.env.JWT_SECRET;
      process.env.JWT_SECRET = 'custom-secret';

      const payload = {
        id: '1',
        username: 'testuser',
        role: 'Admin',
      };

      mockJwt.sign.mockReturnValue('token');

      jwtUtil.generateToken(payload);

      expect(mockJwt.sign).toHaveBeenCalledWith(
        payload,
        'custom-secret',
        expect.any(Object)
      );

      process.env.JWT_SECRET = originalEnv;
    });

    it('should use environment variable for expiration', () => {
      const originalEnv = process.env.JWT_EXPIRATION;
      process.env.JWT_EXPIRATION = '1h';

      const payload = {
        id: '1',
        username: 'testuser',
        role: 'Admin',
      };

      mockJwt.sign.mockReturnValue('token');

      jwtUtil.generateToken(payload);

      expect(mockJwt.sign).toHaveBeenCalledWith(
        payload,
        expect.any(String),
        {
          expiresIn: '1h',
        }
      );

      process.env.JWT_EXPIRATION = originalEnv;
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = 'valid.jwt.token';
      const payload: JwtPayload = {
        id: '1',
        username: 'testuser',
        role: 'Admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      mockJwt.verify.mockReturnValue(payload);

      const result = jwtUtil.verifyToken(token);

      expect(result).toEqual(payload);
      expect(mockJwt.verify).toHaveBeenCalledWith(
        token,
        process.env.JWT_SECRET || 'default-secret-change-in-production'
      );
    });

    it('should throw error for invalid token', () => {
      const token = 'invalid.token';

      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => jwtUtil.verifyToken(token)).toThrow('Invalid token');
    });

    it('should throw error for expired token', () => {
      const token = 'expired.token';

      mockJwt.verify.mockImplementation(() => {
        const error = new Error('Token expired') as any;
        error.name = 'TokenExpiredError';
        throw error;
      });

      expect(() => jwtUtil.verifyToken(token)).toThrow('Token expired');
    });
  });

  describe('decodeToken', () => {
    it('should decode a valid token', () => {
      const token = 'valid.jwt.token';
      const payload: JwtPayload = {
        id: '1',
        username: 'testuser',
        role: 'Admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      mockJwt.decode.mockReturnValue(payload);

      const result = jwtUtil.decodeToken(token);

      expect(result).toEqual(payload);
      expect(mockJwt.decode).toHaveBeenCalledWith(token);
    });

    it('should return null for invalid token', () => {
      const token = 'invalid.token';

      mockJwt.decode.mockReturnValue(null);

      const result = jwtUtil.decodeToken(token);

      expect(result).toBeNull();
    });

    it('should handle decode errors gracefully', () => {
      const token = 'malformed.token';

      mockJwt.decode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = jwtUtil.decodeToken(token);

      expect(result).toBeNull();
    });
  });
});

