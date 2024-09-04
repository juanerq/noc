import { LogEntity, LogSeverityLevel } from "./log.entity";

describe("LogEntity", () => {
  const dataObj = {
    level: LogSeverityLevel.LOW,
    message: "test message",
    origin: "test origin",
  };

  test("should create a LogEntity instance", () => {
    const log = new LogEntity(dataObj);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.level).toBe(dataObj.level);
    expect(log.message).toBe(dataObj.message);
    expect(log.origin).toBe(dataObj.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  test("should create a LogEntity instance from json", () => {
    const json = `{"level":"LOW","message":"Service https://google.com working","origin":"check-service.ts","createdAt":"2024-08-14T19:57:05.706Z"}`;

    const log = LogEntity.fromJson(json);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.level).toBe(LogSeverityLevel.LOW);
    expect(log.message).toBe("Service https://google.com working");
    expect(log.origin).toBe("check-service.ts");
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  test("should create a LogEntity instance from object", () => {
    const log = LogEntity.fromObject(dataObj);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.level).toBe(dataObj.level);
    expect(log.message).toBe(dataObj.message);
    expect(log.origin).toBe(dataObj.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });
});
