import mongoose from "mongoose";
import { LogSeverityLevel } from "../../../domain/entities/log.entity";

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: LogSeverityLevel,
    default: LogSeverityLevel.LOW,
  },
  message: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const LogModel = mongoose.model("Log", logSchema);
