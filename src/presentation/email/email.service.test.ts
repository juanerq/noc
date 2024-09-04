import { EmailService, EmailServiceOptions, SendMailOptions } from "./email.service"
import nodemailer from "nodemailer";

describe('EmailService', () => {
  const mockSendMail = jest.fn()

  nodemailer.createTransport = jest.fn().mockReturnValue({
    sendMail: mockSendMail
  })

  const emailServiceOptions: EmailServiceOptions = {
    service: 'test-service',
    auth: {
      user: 'test@test.com',
      pass: 'testpass'
    }
  }

  const emailService = new EmailService(emailServiceOptions)

  test('Should send email', async () => {

    const sendMailOptions: SendMailOptions = {
      htmlBody: `<div>Test send email</div>`,
      subject: 'test send email',
      to: 'test.email@test.com.co',
      attachments: []
    }

    const mailSent = await emailService.sendEmail(sendMailOptions)

    expect(mockSendMail).toHaveBeenCalledWith({
      html: sendMailOptions.htmlBody,
      subject: sendMailOptions.subject,
      to: sendMailOptions.to,
      attachments: sendMailOptions.attachments
    })
    expect(mailSent).toBeTruthy()

  })

  test('Should send email with attachments', async () => {
    const email = 'test.email@gmail.com'
    await emailService.sendEmailWithFileSystemLogs(email)

    expect(mockSendMail).toHaveBeenCalledWith( {
      to: email,
      subject: 'Logs del servidor',
      html: expect.any(String),     
      attachments: expect.arrayContaining([
        { filename: 'logs-all.log', path: './logs/logs-all.log' },
        { filename: 'logs-high.log', path: './logs/logs-high.log' },
        { filename: 'logs-medium.log', path: './logs/logs-medium.log' }
      ])
    })

  })
})