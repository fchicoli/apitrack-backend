import { PrismaClient } from '@prisma/client';
import { IMonitoredServiceRepository } from '../../../../core/repositories/monitored-service.repository';
import { MonitoredService } from '../../../../core/entities/monitored-service.entity';
import { PrismaMonitoredServiceMapper } from './prisma-monitored-service.mapper';

export type MonitoredServicePrismaClient = Pick<
  PrismaClient,
  'monitoredService'
>;

export class PrismaMonitoredServiceRepository
  implements IMonitoredServiceRepository
{
  constructor(private readonly prisma: MonitoredServicePrismaClient) {}

  async findByUrl(url: string): Promise<MonitoredService | null> {
    const record = await this.prisma.monitoredService.findUnique({
      where: { url },
    });

    if (!record) {
      return null;
    }

    return PrismaMonitoredServiceMapper.toDomain(record);
  }

  async save(service: MonitoredService): Promise<void> {
    const data = PrismaMonitoredServiceMapper.toPersistence(service);

    await this.prisma.monitoredService.create({ data });
  }
}
