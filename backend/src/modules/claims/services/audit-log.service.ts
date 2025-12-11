import { AuditLogRepository } from '../repositories/audit-log.repository';
import { AuditLog } from '../entities/audit-log.entity';
import { User } from '../../authentication/entities/user.entity';
import { logger } from '../../../utils/logger';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'SUBMIT' | 'APPROVE' | 'REJECT' | 'ADD_EXPENSE' | 'DELETE_EXPENSE' | 'ADD_ATTACHMENT' | 'DELETE_ATTACHMENT';

export interface AuditLogData {
  entityType: string;
  entityId: string;
  action: AuditAction;
  user: User;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async log(data: AuditLogData): Promise<AuditLog> {
    try {
      const auditLog = await this.auditLogRepository.create({
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        user: data.user,
        oldValues: data.oldValues ? JSON.stringify(data.oldValues) : undefined,
        newValues: data.newValues ? JSON.stringify(data.newValues) : undefined,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        createdBy: data.user.username,
        updatedBy: data.user.username,
      } as Partial<AuditLog>);

      logger.info(`Audit log created: ${data.action} on ${data.entityType} ${data.entityId}`, {
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        userId: data.user.id,
      });

      return auditLog;
    } catch (error) {
      logger.error('Failed to create audit log', {
        error,
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
      });
      // Don't throw error - audit logging should not break the main flow
      throw error;
    }
  }

  async getEntityHistory(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByEntity(entityType, entityId);
  }

  async getUserActivity(userId: string, limit?: number): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUser(userId, limit);
  }
}

