import { BuzzPostsResponseDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';
interface BuzzRepository {
    findLatestPosts: (limit: number) => Promise<any[]>;
}
export declare class BuzzPostsService {
    private readonly buzzRepository;
    constructor(buzzRepository: BuzzRepository);
    getBuzzPosts(user: MinimalUser, limit?: number): Promise<BuzzPostsResponseDto>;
}
export {};
//# sourceMappingURL=buzz-posts.service.d.ts.map