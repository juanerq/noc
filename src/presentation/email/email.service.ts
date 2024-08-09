import nodemailer from "nodemailer";
import { envs } from "../../config/plugins/env.plugin";
import { LogRepository } from "../../domain/repository/log.repository";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

interface EmailServiceOptions {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments: Attachment[];
}

interface Attachment {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(options: EmailServiceOptions) {
    this.transporter = nodemailer.createTransport({
      service: options.service,
      auth: {
        user: options.auth.user,
        pass: options.auth.pass,
      },
    });
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments,
      });

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]): Promise<boolean> {
    const subject = "Logs del servidor";
    const htmlBody = `
      <h1>Logs del servidor</h1>
    `;
    const attachments: Attachment[] = [
      {
        filename: "logs-all.log",
        path: "./logs/logs-all.log",
      },
      {
        filename: "logs-high.log",
        path: "./logs/logs-high.log",
      },
      {
        filename: "logs-medium.log",
        path: "./logs/logs-medium.log",
      },
    ];

    return this.sendEmail({ to, subject, htmlBody, attachments });
  }
}
