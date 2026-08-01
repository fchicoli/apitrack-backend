import { DomainException } from '../../src/core/entities/domain.exception';
import {
  MonitoredService,
  MonitoredServiceStatus,
} from '../../src/core/entities/monitored-service.entity';
import { IMonitoredServiceRepository } from '../../src/core/repositories/monitored-service.repository';
import { RegisterMonitoredServiceUseCase } from '../../src/use-cases/register-monitored-service.usecase';

class InMemoryMonitoredServiceRepository implements IMonitoredServiceRepository {
  private readonly services: MonitoredService[] = [];

  async findByUrl(url: string): Promise<MonitoredService | null> {
    return this.services.find((service) => service.url === url) ?? null;
  }

  async save(service: MonitoredService): Promise<void> {
    this.services.push(service);
  }
}

describe('RegisterMonitoredServiceUseCase', () => {
  let repository: InMemoryMonitoredServiceRepository;
  let useCase: RegisterMonitoredServiceUseCase;

  beforeEach(() => {
    repository = new InMemoryMonitoredServiceRepository();
    useCase = new RegisterMonitoredServiceUseCase(repository);
  });

  it('should register a monitored service successfully', async () => {
    const input = {
      name: 'Payment API',
      url: 'https://api.example.com/health',
    };

    const result = await useCase.execute(input);

    expect(result).toBeInstanceOf(MonitoredService);
    expect(result.name).toBe(input.name);
    expect(result.url).toBe(input.url);
    expect(result.status).toBe(MonitoredServiceStatus.ACTIVE);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);

    const saved = await repository.findByUrl(input.url);
    expect(saved).not.toBeNull();
    expect(saved?.id).toBe(result.id);
  });

  it('should throw DomainException when URL is already registered', async () => {
    const url = 'https://api.example.com/health';

    await useCase.execute({ name: 'Payment API', url });

    await expect(
      useCase.execute({ name: 'Another Service', url }),
    ).rejects.toThrow(DomainException);

    await expect(
      useCase.execute({ name: 'Another Service', url }),
    ).rejects.toThrow(`Service with URL "${url}" is already registered`);
  });
});
