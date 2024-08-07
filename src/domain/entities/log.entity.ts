export enum LogSeverityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export class LogEntity {
  public createdAt: Date;

  constructor(public level: LogSeverityLevel, public message: string) {
    this.createdAt = new Date();
  }

  static fromJson(json: string): LogEntity {
    const object = JSON.parse(json);

    const log = new LogEntity(object.level, object.message);
    log.createdAt = new Date(object.createdAt);

    return log;
  }
}
