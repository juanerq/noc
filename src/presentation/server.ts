import { envs } from "../config/plugins/env.plugin";
import { LogSeverityLevel } from "../domain/entities/log.entity";
import { CheckService } from "../domain/use-cases/checks/check-service";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const pgLogRepository = new LogRepositoryImpl(new PostgresLogDatasource());
const mongoLogRepository = new LogRepositoryImpl(new MongoLogDatasource());
const fsLogRepository = new LogRepositoryImpl(new FileSystemDatasource());

const emailService = new EmailService({
  service: envs.MAILER_SERVICE,
  auth: {
    user: envs.MAILER_EMAIL,
    pass: envs.MAILER_SECRET_LEY,
  },
});

export class Server {
  public static async start() {
    console.log("Server started...");
    //const logs = await logRepository.getLogs(LogSeverityLevel.LOW);

    // const sendEmailLogs = new SendEmailLogs(emailService, logRepository);
    // sendEmailLogs.execute("jrjuanreyes64@gmail.com");
    // emailService.sendEmailWithFileSystemLogs("jrjuanreyes64@gmail.com");

    const url = "https://google.com";
    CronService.createJob("*/5 * * * * *", () => {
      new CheckServiceMultiple(
        [pgLogRepository, mongoLogRepository, fsLogRepository],
        () => console.log(`${url} is ok`),
        (error) => console.log(error)
      ).execute(url);
    });
  }
}
