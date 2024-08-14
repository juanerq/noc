import { PrismaClient } from "@prisma/client";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

const prismaClient = new PrismaClient();

export class PostgresLogDatasource implements LogDatasource {
  async saveLog(log: LogEntity): Promise<void> {
    const newLog = await prismaClient.logModel.create({
      data: log,
    });
    console.log(newLog);
  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logs = await prismaClient.logModel.findMany({
      where: {
        level: severityLevel,
      },
    });
    return logs.map(LogEntity.fromObject);
  }
}
