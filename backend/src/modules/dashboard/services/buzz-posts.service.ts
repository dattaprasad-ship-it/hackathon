import { BuzzPostDto, BuzzPostsResponseDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';

interface BuzzRepository {
  findLatestPosts: (limit: number) => Promise<any[]>;
}

export class BuzzPostsService {
  constructor(private readonly buzzRepository: BuzzRepository) {}

  async getBuzzPosts(user: MinimalUser, limit: number = 5): Promise<BuzzPostsResponseDto> {
    const validatedLimit = Math.min(Math.max(1, limit), 20);

    const posts = await this.buzzRepository.findLatestPosts(validatedLimit);

    const postDtos: BuzzPostDto[] = posts.map((post) => ({
      id: post.id,
      author: {
        id: post.author?.id || post.userId,
        name: post.author?.name || 'Unknown',
        displayName: post.author?.displayName || post.author?.name || 'Unknown',
        profilePicture: post.author?.profilePicture || null,
      },
      content: post.content || '',
      images: (post.images || []).map((img: any) => ({
        url: img.url || '',
        thumbnail: img.thumbnail || img.url || '',
      })),
      timestamp: post.timestamp ? new Date(post.timestamp).toISOString() : new Date().toISOString(),
      likes: post.likes || 0,
      comments: post.comments || 0,
    }));

    postDtos.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return {
      posts: postDtos,
      totalCount: postDtos.length,
    };
  }
}

