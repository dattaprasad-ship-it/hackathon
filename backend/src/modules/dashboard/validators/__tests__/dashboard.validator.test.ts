import { describe, it, expect } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { validateEmployeesOnLeaveQuery, validateBuzzPostsQuery } from '../dashboard.validator';

describe('dashboard.validator', () => {
  describe('validateEmployeesOnLeaveQuery', () => {
    it('should pass validation with valid date', () => {
      const req = {
        query: { date: '2025-01-12' },
      } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;

      validateEmployeesOnLeaveQuery(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should pass validation without date (optional)', () => {
      const req = {
        query: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;

      validateEmployeesOnLeaveQuery(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should fail validation with invalid date format', () => {
      const req = {
        query: { date: 'invalid-date' },
      } as unknown as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      validateEmployeesOnLeaveQuery(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateBuzzPostsQuery', () => {
    it('should pass validation with valid limit', () => {
      const req = {
        query: { limit: '10' },
      } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;

      validateBuzzPostsQuery(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should pass validation without limit (optional)', () => {
      const req = {
        query: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;

      validateBuzzPostsQuery(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should fail validation with limit less than 1', () => {
      const req = {
        query: { limit: '0' },
      } as unknown as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      validateBuzzPostsQuery(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail validation with limit greater than 20', () => {
      const req = {
        query: { limit: '21' },
      } as unknown as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      validateBuzzPostsQuery(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});

