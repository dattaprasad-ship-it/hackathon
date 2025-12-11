import { describe, it, expect, vi, beforeEach } from 'vitest';
import { when } from 'jest-when';
import { BuzzPostsService } from '../buzz-posts.service';

describe('BuzzPostsService', () => {
  let service: BuzzPostsService;
  let mockBuzzRepository: any;
  let mockUser: any;

  beforeEach(() => {
    mockBuzzRepository = {
      findLatestPosts: vi.fn(),
    };
    service = new BuzzPostsService(mockBuzzRepository);
    mockUser = {
      id: 'user-1',
      username: 'testuser',
      role: 'Employee',
    };
  });

  describe('getBuzzPosts', () => {
    it('should return posts sorted by timestamp (newest first)', async () => {
      const mockPosts = [
        {
          id: 'post-1',
          content: 'Older post',
          timestamp: new Date('2025-01-10T10:00:00Z'),
          author: { id: 'user-1', name: 'User 1' },
        },
        {
          id: 'post-2',
          content: 'Newer post',
          timestamp: new Date('2025-01-12T10:00:00Z'),
          author: { id: 'user-2', name: 'User 2' },
        },
      ];

      when(mockBuzzRepository.findLatestPosts)
        .calledWith(5)
        .mockResolvedValue(mockPosts);

      const result = await service.getBuzzPosts(mockUser, 5);

      expect(result.posts).toHaveLength(2);
      expect(result.posts[0].content).toBe('Newer post');
      expect(result.posts[1].content).toBe('Older post');
    });

    it('should limit posts to specified limit', async () => {
      const mockPosts = Array.from({ length: 10 }, (_, i) => ({
        id: `post-${i}`,
        content: `Post ${i}`,
        timestamp: new Date(),
        author: { id: 'user-1', name: 'User 1' },
      }));

      when(mockBuzzRepository.findLatestPosts)
        .calledWith(5)
        .mockResolvedValue(mockPosts.slice(0, 5));

      const result = await service.getBuzzPosts(mockUser, 5);

      expect(result.posts).toHaveLength(5);
    });

    it('should enforce maximum limit of 20', async () => {
      when(mockBuzzRepository.findLatestPosts)
        .calledWith(20)
        .mockResolvedValue([]);

      await service.getBuzzPosts(mockUser, 25);

      expect(mockBuzzRepository.findLatestPosts).toHaveBeenCalledWith(20);
    });

    it('should enforce minimum limit of 1', async () => {
      when(mockBuzzRepository.findLatestPosts)
        .calledWith(1)
        .mockResolvedValue([]);

      await service.getBuzzPosts(mockUser, 0);

      expect(mockBuzzRepository.findLatestPosts).toHaveBeenCalledWith(1);
    });

    it('should use default limit of 5 when not specified', async () => {
      when(mockBuzzRepository.findLatestPosts)
        .calledWith(5)
        .mockResolvedValue([]);

      await service.getBuzzPosts(mockUser);

      expect(mockBuzzRepository.findLatestPosts).toHaveBeenCalledWith(5);
    });
  });
});

