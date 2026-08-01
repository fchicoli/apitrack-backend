import {
  MonitoredServiceStatus as PrismaMonitoredServiceStatus,
} from '@prisma/client';
import {
  MonitoredService,
  MonitoredServiceStatus,
} from '../../src/core/entities/monitored-service.entity';
import { PrismaMonitoredServiceMapper } from '../../src/infrastructure/database/prisma/repositories/prisma-monitored-service.mapper';
import {
  MonitoredServicePrismaClient,
  PrismaMonitoredServiceRepository,
} from '../../src/infrastructure/database/prisma/repositories/prisma-monitored-service.repository';

describe('PrismaMonitoredServiceRepository', () => {
  const createdAt = new Date('2026-01-15T10:00:00.000Z');
  const updatedAt = new Date('2026-01-15T10:00:00.000Z');

  const domainService = MonitoredService.restore({
    id: 'service-id-1',
    name: 'Payment API',
    url: 'https://api.example.com/health',
    status: MonitoredServiceStatus.ACTIVE,
    createdAt,
    updatedAt,
  });

  const prismaRecord = {
    id: 'service-id-1',
    name: 'Payment API',
    url: 'https://api.example.com/health',
    status: PrismaMonitoredServiceStatus.ACTIVE,
    createdAt,
    updatedAt,
  };

  let prismaClient: MonitoredServicePrismaClient;
  let repository: PrismaMonitoredServiceRepository;

  beforeEach(() => {
    prismaClient = {
      monitoredService: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    } as unknown as MonitoredServicePrismaClient;

    repository = new PrismaMonitoredServiceRepository(prismaClient);
  });

  describe('findByUrl', () => {
    it('should query Prisma by url and map the record to a domain entity', async () => {
      jest
        .spyOn(prismaClient.monitoredService, 'findUnique')
        .mockResolvedValue(prismaRecord);

      const result = await repository.findByUrl(domainService.url);

      expect(prismaClient.monitoredService.findUnique).toHaveBeenCalledWith({
        where: { url: domainService.url },
      });
      expect(result).toEqual(
        PrismaMonitoredServiceMapper.toDomain(prismaRecord),
      );
      expect(result).toBeInstanceOf(MonitoredService);
    });

    it('should return null when Prisma does not find a record', async () => {
      jest
        .spyOn(prismaClient.monitoredService, 'findUnique')
        .mockResolvedValue(null);

      const result = await repository.findByUrl(domainService.url);

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should map the domain entity and persist it through Prisma create', async () => {
      jest.spyOn(prismaClient.monitoredService, 'create').mockResolvedValue(
        prismaRecord,
      );

      await repository.save(domainService);

      expect(prismaClient.monitoredService.create).toHaveBeenCalledWith({
        data: PrismaMonitoredServiceMapper.toPersistence(domainService),
      });
    });
  });
});
