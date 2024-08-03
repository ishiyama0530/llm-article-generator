import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { config } from "dotenv";
import { execute } from "./app";
import { logger } from "./utils/logger";

config();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(process.env.TZ || "Asia/Tokyo");

execute().catch(logger.error);
