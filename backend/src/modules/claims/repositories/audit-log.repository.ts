import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { AuditLog } from '../entities/audit-log.entity';

export class AuditLogRepository extends IGenericRepository<AuditLog> {
  constructor(repository: Repository<AuditLog>) {
    super(repository);
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.repository.find({
      where: {
        entityType,
        entityId,
      } as any,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user'],
    });
  }

  async findByUser(userId: string, limit?: number): Promise<AuditLog[]> {
    const query = this.repository
      .createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.user', 'user')
      .where('auditLog.user.id = :userId', { userId })
      .orderBy('auditLog.createdAt', 'DESC');

    if (limit) {
      query.limit(limit);
    }

    return query.getMany();
  }
}

