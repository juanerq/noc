import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { CheckService } from "./check-service";
import { CheckServiceMultiple } from "./check-service-multiple";

describe("CheckService UseCase", () => {
  const mockLogRepositories = [
    {
      saveLog: jest.fn(),
      getLogs: jest.fn(),
    },
    {
      saveLog: jest.fn(),
      getLogs: jest.fn(),
    },
  ];

  const successCallback = jest.fn();
  const errorCallback = jest.fn();

  const checkService = new CheckServiceMultiple(
    mockLogRepositories,
    successCallback,
    errorCallback
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call successCallBacks when fetch return true", async () => {
    const url = "https://google.com/";

    const wasOk = await checkService.execute(url);

    expect(wasOk).toBe(true);
    expect(mockLogRepositories[0].saveLog).toHaveBeenCalled();
    expect(mockLogRepositories[0].saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(mockLogRepositories[0].saveLog).toHaveBeenCalled();
    expect(mockLogRepositories[0].saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  test("should call errorCallBack when fetch return true", async () => {
    const url = "https://test-error.com/";

    const wasOk = await checkService.execute(url);

    expect(wasOk).toBe(false);
    expect(mockLogRepositories[0].saveLog).toHaveBeenCalled();
    expect(mockLogRepositories[0].saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(mockLogRepositories[1].saveLog).toHaveBeenCalled();
    expect(mockLogRepositories[1].saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalled();
  });

  test("should return false on error thrown by fetch", async () => {
    const url = "https://example.com";
    const error = new Error(`Error on check service ${url}`);

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    const result = await checkService.execute(url);

    expect(result).toBe(false);
    expect(mockLogRepositories[0].saveLog).toHaveBeenCalledTimes(1);
    expect(mockLogRepositories[0].saveLog).toHaveBeenCalledWith(
      expect.objectContaining({
        level: LogSeverityLevel.HIGH,
        message: `${url} is no ok: ${error}`,
        origin: "check-service.ts",
      })
    );
    expect(mockLogRepositories[1].saveLog).toHaveBeenCalledTimes(1);
    expect(mockLogRepositories[1].saveLog).toHaveBeenCalledWith(
      expect.objectContaining({
        level: LogSeverityLevel.HIGH,
        message: `${url} is no ok: ${error}`,
        origin: "check-service.ts",
      })
    );
    expect(errorCallback).toHaveBeenCalledTimes(1);
  });
});
