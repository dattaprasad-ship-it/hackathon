import { UserRepository } from '../repositories/user.repository';
import { LoginAttemptRepository } from '../repositories/login-attempt.repository';
import { RateLimitService } from './rate-limit.service';
import { LoginDto, LoginResponseDto } from '../dto/authentication.dto';
export declare class AuthenticationService {
    private readonly userRepository;
    private readonly loginAttemptRepository;
    private readonly rateLimitService;
    constructor(userRepository: UserRepository, loginAttemptRepository: LoginAttemptRepository, rateLimitService: RateLimitService);
    login(credentials: LoginDto, ipAddress: string): Promise<LoginResponseDto>;
}
//# sourceMappingURL=authentication.service.d.ts.map