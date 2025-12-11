import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CacheUtil } from '../cache.util';

describe('CacheUtil', () => {
  beforeEach(() => {
    CacheUtil.clear();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      const result = CacheUtil.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should return cached value for existing key', () => {
      CacheUtil.set('test-key', { data: 'test' }, 60);
      const result = CacheUtil.get('test-key');
      expect(result).toEqual({ data: 'test' });
    });

    it('should return null for expired cache entry', () => {
      CacheUtil.set('test-key', { data: 'test' }, 0.001);
      vi.useFakeTimers();
      vi.advanceTimersByTime(2000);
      const result = CacheUtil.get('test-key');
      expect(result).toBeNull();
      vi.useRealTimers();
    });
  });

  describe('set', () => {
    it('should store value in cache', () => {
      CacheUtil.set('test-key', { data: 'test' }, 60);
      const result = CacheUtil.get('test-key');
      expect(result).toEqual({ data: 'test' });
    });
  });

  describe('delete', () => {
    it('should remove cached value', () => {
      CacheUtil.set('test-key', { data: 'test' }, 60);
      CacheUtil.delete('test-key');
      const result = CacheUtil.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      CacheUtil.set('key1', { data: '1' }, 60);
      CacheUtil.set('key2', { data: '2' }, 60);
      CacheUtil.clear();
      expect(CacheUtil.get('key1')).toBeNull();
      expect(CacheUtil.get('key2')).toBeNull();
    });
  });
});

