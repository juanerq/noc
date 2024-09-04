import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { LogRepositoryImpl } from "./log.repository.impl";

describe("LogRepositoryImpl", () => {
  const mockDatasource = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const logRepository = new LogRepositoryImpl(mockDatasource);

  const log = new LogEntity({
    level: LogSeverityLevel.HIGH,
    message: "test",
    origin: "test",
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("saveLog should call the datasource with arguments", async () => {
    await logRepository.saveLog(log);

    expect(mockDatasource.saveLog).toHaveBeenCalledTimes(1);
    expect(mockDatasource.saveLog).toHaveBeenCalledWith(log);
  });

  test("getLogs should call the datasource with arguments", async () => {
    mockDatasource.getLogs.mockReturnValue([log]);

    const logs = await logRepository.getLogs(LogSeverityLevel.HIGH);

    expect(mockDatasource.getLogs).toHaveBeenCalledTimes(1);
    expect(mockDatasource.getLogs).toHaveBeenCalledWith(LogSeverityLevel.HIGH);
    expect(logs).toHaveLength(1);
    expect(logs[0]).toBeInstanceOf(LogEntity);
    expect(logs[0]).toEqual(log);
  });
});
