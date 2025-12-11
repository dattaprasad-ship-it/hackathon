import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { LoginAttempt } from '../entities/login-attempt.entity';

export class LoginAttemptRepository extends IGenericRepository<LoginAttempt> {
  constructor(repository: Repository<LoginAttempt>) {
    super(repository);
  }

  async createAttempt(attempt: {
    username: string;
    ipAddress: string;
    success: boolean;
    failureReason?: string;
    attemptTimestamp: Date;
  }): Promise<LoginAttempt> {
    const newAttempt = this.repository.create(attempt);
    return this.repository.save(newAttempt);
  }

  async findRecentAttemptsByIp(
    ipAddress: string,
    since: Date
  ): Promise<LoginAttempt[]> {
    return this.repository.find({
      where: {
        ipAddress,
        attemptTimestamp: MoreThanOrEqual(since),
      },
      order: {
        attemptTimestamp: 'DESC',
      },
    });
  }

  async findRecentAttemptsByUsername(
    username: string,
    since: Date
  ): Promise<LoginAttempt[]> {
    return this.repository.find({
      where: {
        username,
        attemptTimestamp: MoreThanOrEqual(since),
      },
      order: {
        attemptTimestamp: 'DESC',
      },
    });
  }

  async countRecentAttemptsByIp(ipAddress: string, since: Date): Promise<number> {
    return this.repository.count({
      where: {
        ipAddress,
        attemptTimestamp: MoreThanOrEqual(since),
      },
    });
  }

  async countRecentAttemptsByUsername(
    username: string,
    since: Date
  ): Promise<number> {
    return this.repository.count({
      where: {
        username,
        attemptTimestamp: MoreThanOrEqual(since),
      },
    });
  }
}

