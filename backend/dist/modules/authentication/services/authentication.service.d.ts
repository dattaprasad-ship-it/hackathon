import { UserRepository } from '../repositories/user.repository';
import { LoginDto, LoginResponseDto } from '../dto/authentication.dto';
export declare class AuthenticationService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    login(credentials: LoginDto): Promise<LoginResponseDto>;
}
//# sourceMappingURL=authentication.service.d.ts.map