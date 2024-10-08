export enum LogSeverityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface LogEntityOptions {
  level: LogSeverityLevel;
  message: string;
  origin: string;
  createdAt?: Date;
}

export class LogEntity {
  public level: LogSeverityLevel;
  public message: string;
  public origin: string;
  public createdAt: Date;

  constructor(options: LogEntityOptions) {
    const { level, message, origin, createdAt = new Date() } = options;
    this.level = level;
    this.message = message;
    this.origin = origin;
    this.createdAt = createdAt;
  }

  static fromJson(json: string): LogEntity {
    const { level, message, origin, createdAt } = JSON.parse(json);

    const log = new LogEntity({
      level,
      message,
      origin,
      createdAt: new Date(createdAt),
    });

    return log;
  }

  static fromObject(object: { [key: string]: any }) {
    const { level, message, origin, createdAt } = object;

    return new LogEntity({
      level,
      message,
      origin,
      createdAt,
    });
  }
}
