import fs from "fs";
import path from "path";
import getAppDataPath from "appdata-path";

const DEFAULT_LOG_LEVEL = "debug";
const levels = ["NONE", "LOG", "INFO", "VERBOSE", "DEBUG"];
const LOG_PATH = path.join(getAppDataPath(), "Red Giant Toolkit", "Logs");

function getLevel(level) {
  level = level.toUpperCase();
  if (!levels.includes(level)) {
    return -1;
  } else {
    return levels.indexOf(level);
  }
}

export default class Log {
  constructor() {
    this.level = getLevel(process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL);
    this.checkFilePath();
  }

  checkFilePath() {
    // let path = DEFAULT_PATHS[process.platform];
    fs.mkdirSync(LOG_PATH, {
      recursive: true
    });
  }

  getTime() {
    let date = new Date();
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
  }

  addTimestamp(message) {
    if (typeof message == "string") {
      message = `[${this.getTime()}] ${message}`;
    }

    return message;
  }

  checkLevel() {
    if (
      process.env.LOG_LEVEL != null &&
      getLevel(process.env.LOG_LEVEL) != getLevel(this.level)
    ) {
      this.level = getLevel(process.env.LOG_LEVEL);
    }
  }

  write(message, level) {
    if (console) {
      if (level == "warning") {
        console.warn(message);
      } else if (level == "error") {
        console.error(message);
      } else {
        console.log(message);
      }
    }
    let filepath = LOG_PATH;
    let filename;
    if (level == "warning") {
      filename = path.join(filepath, "warning.log");
    } else if (level == "error") {
      filename = path.join(filepath, "error.log");
    } else {
      filename = path.join(filepath, "log.log");
    }
    console.log("[Log] writing file to: " + filename);
    fs.writeFileSync(filename, message + "\n", {
      encoding: "utf-8",
      flag: "a"
    });
  }

  print(level, message) {
    this.checkLevel();

    if (this.level < levels.indexOf(level)) {
      return;
    }

    if (typeof message == "string") {
      message = `[${level}] ${this.addTimestamp(message)}`;
    }

    this.write(message, level);

    // console.log(message);
  }

  log(message) {
    this.print("LOG", message);
  }

  info(message) {
    this.print("INFO", message);
  }

  verbose(message) {
    this.print("VERBOSE", message);
  }

  debug(message) {
    this.print("DEBUG", message);
  }

  warning(message) {
    if (this.level == 0) {
      return;
    }

    message = this.addTimestamp(message);

    // console.warn(message);
    this.write(message, "warning");
  }

  error(message) {
    if (this.level == 0) {
      return;
    }

    message = this.addTimestamp(message);

    // console.error(message);
    this.write(message, "error");
  }
}
