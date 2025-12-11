"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuzzPostsService = void 0;
class BuzzPostsService {
    constructor(buzzRepository) {
        this.buzzRepository = buzzRepository;
    }
    async getBuzzPosts(user, limit = 5) {
        const validatedLimit = Math.min(Math.max(1, limit), 20);
        const posts = await this.buzzRepository.findLatestPosts(validatedLimit);
        const postDtos = posts.map((post) => ({
            id: post.id,
            author: {
                id: post.author?.id || post.userId,
                name: post.author?.name || 'Unknown',
                displayName: post.author?.displayName || post.author?.name || 'Unknown',
                profilePicture: post.author?.profilePicture || null,
            },
            content: post.content || '',
            images: (post.images || []).map((img) => ({
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
exports.BuzzPostsService = BuzzPostsService;
//# sourceMappingURL=buzz-posts.service.js.map