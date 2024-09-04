import mongoose from "mongoose";
import { envs } from "../../config/plugins/env.plugin";
import { LogModel, MongoDatabase } from "../../data/mongo";
import { MongoLogDatasource } from "./mongo-log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

describe("MongoLogDatasource", () => {
  const logDatasource = new MongoLogDatasource();

  const log = new LogEntity({
    level: LogSeverityLevel.HIGH,
    message: "test",
    origin: "test",
  });

  beforeAll(async () => {
    await MongoDatabase.connect({
      mongoUrl: envs.MONGO_URL,
      dbName: envs.MONGO_DB_NAME,
    });
  });

  afterEach(async () => {
    await LogModel.deleteMany({});
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  test("should create a log", async () => {
    const logModelSpy = jest.spyOn(LogModel, "create");
    const logSpy = jest.spyOn(console, "log");

    await logDatasource.saveLog(log);

    expect(logDatasource).toBeInstanceOf(MongoLogDatasource);
    expect(logModelSpy).toHaveBeenCalledTimes(1);
    expect(logModelSpy).toHaveBeenCalledWith(log);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenLastCalledWith("Log created", expect.any(String));
  });

  test("should get logs", async () => {
    await logDatasource.saveLog(log);

    const logs = await logDatasource.getLogs(LogSeverityLevel.HIGH);

    expect(logs).toHaveLength(1);
    expect(logs).toContainEqual(log);
    expect(logs[0]).toBeInstanceOf(LogEntity);
    expect(logs[0].level).toEqual(LogSeverityLevel.HIGH);
  });
});
