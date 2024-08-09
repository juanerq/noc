import { EmailService } from "../../../presentation/email/email.service";
import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface SendLogsEmailUseCase {
  execute(to: string | string[]): Promise<boolean>;
}

export class SendEmailLogs implements SendLogsEmailUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository
  ) {}

  async execute(to: string | string[]): Promise<boolean> {
    try {
      const sent = await this.emailService.sendEmailWithFileSystemLogs(to);
      if (!sent) {
        throw new Error("Error sending email");
      }

      const log = new LogEntity({
        level: LogSeverityLevel.LOW,
        message: "Email sent",
        origin: "email.service.ts",
      });

      this.logRepository.saveLog(log);

      return true;
    } catch (error) {
      const log = new LogEntity({
        level: LogSeverityLevel.HIGH,
        message: `Error sending email: ${error}`,
        origin: "send-email-logs.ts",
      });

      this.logRepository.saveLog(log);

      return false;
    }
  }
}
