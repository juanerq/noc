import mongoose from "mongoose";
import { envs } from "../../config/plugins/env.plugin";
import { MongoDatabase } from "./init";

describe("init MongoDB", () => {
  afterAll(async () => {
    mongoose.connection.close();
  });

  test("should connect to MongoDB", async () => {
    const connected = await MongoDatabase.connect({
      mongoUrl: process.env.MONGO_URL!,
      dbName: process.env.MONGO_DB_NAME!,
    });

    expect(connected).toBe(true);
  });

  test("should throw an error", async () => {
    await expect(
      MongoDatabase.connect({
        mongoUrl: "mongodb://admin:1111@localhost:1111",
        dbName: process.env.MONGO_DB_NAME!,
      })
    ).rejects.toThrow();
  });
});
