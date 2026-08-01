export enum MonitoredServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface MonitoredServiceProps {
  id: string;
  name: string;
  url: string;
  status: MonitoredServiceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMonitoredServiceProps {
  name: string;
  url: string;
}

export class MonitoredService {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly status: MonitoredServiceStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: MonitoredServiceProps) {
    this.id = props.id;
    this.name = props.name;
    this.url = props.url;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: CreateMonitoredServiceProps): MonitoredService {
    const now = new Date();

    return new MonitoredService({
      id: crypto.randomUUID(),
      name: props.name,
      url: props.url,
      status: MonitoredServiceStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: MonitoredServiceProps): MonitoredService {
    return new MonitoredService(props);
  }
}
