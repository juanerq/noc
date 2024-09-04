import mongoose from "mongoose";
import { envs } from "../../../config/plugins/env.plugin";
import { MongoDatabase } from "../init";
import { LogSeverityLevel } from "../../../domain/entities/log.entity";
import { LogModel } from "./log.model";

describe("log.model.test.ts", () => {
  beforeAll(async () => {
    await MongoDatabase.connect({
      mongoUrl: envs.MONGO_URL,
      dbName: envs.MONGO_DB_NAME,
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  test("should return LogModel", async () => {
    const logData = {
      level: LogSeverityLevel.LOW,
      message: "test",
      origin: "test",
    };

    const log = await LogModel.create(logData);

    expect(log).toEqual(
      expect.objectContaining({
        ...logData,
        createdAt: expect.any(Date),
        id: expect.any(String),
      })
    );

    await log.deleteOne();
  });

  test("should return the schema object", () => {
    const schema = LogModel.schema.obj;

    expect(schema).toEqual(
      expect.objectContaining({
        level: {
          type: expect.any(Function),
          enum: { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH" },
          default: "LOW",
        },
        message: { type: expect.any(Function), required: true },
        origin: { type: expect.any(Function) },
        createdAt: expect.any(Object),
      })
    );
  });
});
