import { EmailService } from "../../../presentation/email/email.service";
import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";
import { SendEmailLogs } from "./send-email-logs";

describe("Send Email Logs UseCase", () => {
  const mockEmailService = {
    sendEmailWithFileSystemLogs: jest.fn().mockReturnValue(true),
  };

  const mockLogRepository: LogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const sendEmailLogs = new SendEmailLogs(
    mockEmailService as any,
    mockLogRepository
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call sendEmail and saveLog", async () => {
    const to = "test@to.com";

    const result = await sendEmailLogs.execute(to);

    expect(result).toBe(true);
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledTimes(
      1
    );
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledWith(
      to
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalledTimes(1);
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
      expect.objectContaining({
        level: LogSeverityLevel.LOW,
        message: "Email sent",
        origin: "email.service.ts",
      })
    );
  });

  test("should log in case of error", async () => {
    mockEmailService.sendEmailWithFileSystemLogs.mockReturnValue(false);

    const to = "test@to.com";
    const error = new Error("Error sending email");

    const result = await sendEmailLogs.execute(to);

    expect(result).toBe(false);
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledTimes(
      1
    );
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledWith(
      to
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalledTimes(1);
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
      expect.objectContaining({
        level: LogSeverityLevel.HIGH,
        message: `Error sending email: ${error}`,
        origin: "send-email-logs.ts",
      })
    );
  });
});
