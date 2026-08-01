import { MonitoredService } from '../entities/monitored-service.entity';

export interface IMonitoredServiceRepository {
  findByUrl(url: string): Promise<MonitoredService | null>;
  save(service: MonitoredService): Promise<void>;
}
