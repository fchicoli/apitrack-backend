import {
  MonitoredService as PrismaMonitoredService,
  MonitoredServiceStatus as PrismaMonitoredServiceStatus,
} from '@prisma/client';
import {
  MonitoredService,
  MonitoredServiceStatus,
} from '../../../../core/entities/monitored-service.entity';

export class PrismaMonitoredServiceMapper {
  static toDomain(record: PrismaMonitoredService): MonitoredService {
    return MonitoredService.restore({
      id: record.id,
      name: record.name,
      url: record.url,
      status: this.toDomainStatus(record.status),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(service: MonitoredService): PrismaMonitoredService {
    return {
      id: service.id,
      name: service.name,
      url: service.url,
      status: this.toPersistenceStatus(service.status),
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }

  private static toDomainStatus(
    status: PrismaMonitoredServiceStatus,
  ): MonitoredServiceStatus {
    switch (status) {
      case PrismaMonitoredServiceStatus.ACTIVE:
        return MonitoredServiceStatus.ACTIVE;
      case PrismaMonitoredServiceStatus.INACTIVE:
        return MonitoredServiceStatus.INACTIVE;
    }
  }

  private static toPersistenceStatus(
    status: MonitoredServiceStatus,
  ): PrismaMonitoredServiceStatus {
    switch (status) {
      case MonitoredServiceStatus.ACTIVE:
        return PrismaMonitoredServiceStatus.ACTIVE;
      case MonitoredServiceStatus.INACTIVE:
        return PrismaMonitoredServiceStatus.INACTIVE;
    }
  }
}
