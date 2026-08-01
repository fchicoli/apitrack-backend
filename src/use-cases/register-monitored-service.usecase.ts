import { DomainException } from '../core/entities/domain.exception';
import { MonitoredService } from '../core/entities/monitored-service.entity';
import { IMonitoredServiceRepository } from '../core/repositories/monitored-service.repository';

export interface RegisterMonitoredServiceInput {
  name: string;
  url: string;
}

export class RegisterMonitoredServiceUseCase {
  constructor(
    private readonly monitoredServiceRepository: IMonitoredServiceRepository,
  ) {}

  async execute(
    input: RegisterMonitoredServiceInput,
  ): Promise<MonitoredService> {
    const existingService =
      await this.monitoredServiceRepository.findByUrl(input.url);

    if (existingService) {
      throw new DomainException(
        `Service with URL "${input.url}" is already registered`,
      );
    }

    const service = MonitoredService.create({
      name: input.name,
      url: input.url,
    });

    await this.monitoredServiceRepository.save(service);

    return service;
  }
}
