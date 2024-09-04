import nodemailer from "nodemailer";

export interface EmailServiceOptions {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

export interface SendMailOptions {
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
