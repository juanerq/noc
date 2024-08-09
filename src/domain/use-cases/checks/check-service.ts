import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckService implements CheckServiceUseCase {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {}

  async execute(url: string) {
    try {
      const req = await fetch(url);

      if (!req.ok) {
        throw new Error(`Error on check service ${url}`);
      }

      const log = new LogEntity({
        level: LogSeverityLevel.LOW,
        message: `Service ${url} working`,
        origin: "check-service.ts",
      });
      this.logRepository.saveLog(log);
      this.successCallback && this.successCallback();

      return true;
    } catch (error) {
      const errorMessage = `${url} is no ok: ${error}`;

      const log = new LogEntity({
        level: LogSeverityLevel.HIGH,
        message: errorMessage,
        origin: "check-service.ts",
      });
      this.logRepository.saveLog(log);

      this.errorCallback && this.errorCallback(errorMessage);

      return false;
    }
  }
}
