import { envs } from "../config/plugins/env.plugin";
import { CheckService } from "../domain/use-cases/checks/check-service";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const fileSystemRepository = new LogRepositoryImpl(new FileSystemDatasource());
const emailService = new EmailService({
  service: envs.MAILER_SERVICE,
  auth: {
    user: envs.MAILER_EMAIL,
    pass: envs.MAILER_SECRET_LEY,
  },
});

export class Server {
  public static start() {
    console.log("Server started...");

    const sendEmailLogs = new SendEmailLogs(emailService, fileSystemRepository);
    sendEmailLogs.execute("jrjuanreyes64@gmail.com");

    //const emailService = new EmailService(fileSystemRepository);

    //emailService.sendEmailWithFileSystemLogs("jrjuanreyes64@gmail.com");

    // const url = "https://google.com";

    // CronService.createJob("*/5 * * * * *", () => {
    //   new CheckService(
    //     fileSystemRepository,
    //     () => console.log(`${url} is ok`),
    //     (error) => console.log(error)
    //   ).execute(url);
    // });
  }
}
