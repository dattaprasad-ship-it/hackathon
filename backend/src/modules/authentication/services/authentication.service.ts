import { UserRepository } from '../repositories/user.repository';
import { passwordUtil } from '../utils/password.util';
import { jwtUtil } from '../utils/jwt.util';
import { AccountStatus } from '../../../constants/enums/account-status.enum';
import { LoginDto, LoginResponseDto } from '../dto/authentication.dto';
import { BusinessException } from '../../../common/exceptions/business.exception';

export class AuthenticationService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(credentials: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = credentials;

    if (!username || !password) {
      throw new BusinessException('Username and password are required', 400);
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      throw new BusinessException('Username and password cannot be empty', 400);
    }

    const user = await this.userRepository.findByUsername(trimmedUsername);

    if (!user) {
      throw new BusinessException('Invalid username or password', 401);
    }

    const isPasswordValid = await passwordUtil.verifyPassword(
      trimmedPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new BusinessException('Invalid username or password', 401);
    }

    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new BusinessException(
        `Account is ${user.accountStatus.toLowerCase()}. Please contact administrator.`,
        403
      );
    }

    const token = jwtUtil.generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    await this.userRepository.updateLastLogin(user.id, new Date());

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        displayName: user.displayName,
      },
    };
  }
}

