import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../common/enums';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(
    action: AuditAction,
    entityType: string,
    entityId: string | null = null,
    userId: string | null = null,
    ipAddress: string | null = null,
    metadata: Record<string, any> | null = null,
  ): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      userId: userId || undefined,
      action,
      entityType,
      entityId: entityId || undefined,
      ipAddress: ipAddress || undefined,
      metadata: metadata || undefined,
    });

    return this.auditLogRepository.save(auditLog);
  }

  async findAll(limit: number = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findByUser(userId: string, limit: number = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findByAction(action: AuditAction, limit: number = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { action },
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }
}
