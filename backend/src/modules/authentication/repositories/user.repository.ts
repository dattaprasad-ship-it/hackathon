import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { User } from '../entities/user.entity';

export class UserRepository extends IGenericRepository<User> {
  constructor(repository: Repository<User>) {
    super(repository);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({
      where: {
        username: ILike(username),
      } as FindOptionsWhere<User>,
    });
  }

  async updateLastLogin(userId: string, lastLoginAt: Date): Promise<void> {
    await this.repository.update(userId, { lastLoginAt } as Partial<User>);
  }
}

