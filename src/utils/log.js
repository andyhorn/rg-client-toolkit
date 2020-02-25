import fs from "fs";
import path from "path";
import getAppDataPath from "appdata-path";
const { remote } = require("electron");

const levels = ["NONE", "INFO", "VERBOSE", "DEBUG"];
const LOG_PATH = path.join(getAppDataPath(), "Red Giant Toolkit", "Logs");

class Log {
  constructor() {
    if (!Log.instance) {
      Log.instance = this;
      this.level = () => {
        let level = getLogLevel();
        return levelToInt(level);
      }
      this.checkFilePath();
    }
    return Log.instance;
  }

  checkFilePath() {
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

    fs.writeFileSync(filename, message + "\n", {
      encoding: "utf-8",
      flag: "a"
    });
  }

  print(level, message) {
    if (this.level() < levelToInt(level)) {
      return;
    }

    if (typeof message == "string") {
      message = `[${level}] ${this.addTimestamp(message)}`;
    }

    this.write(message, level);
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

    this.write(message, "warning");
  }

  error(message) {
    if (this.level == 0) {
      return;
    }

    message = this.addTimestamp(message);

    this.write(message, "error");
  }
}

function levelToInt(level) {
  level = level.toUpperCase();
  if (!levels.includes(level)) {
    return -1;
  } else {
    return levels.indexOf(level);
  }
}

function getLogLevel() {
  let logLevel = remote.getGlobal("LOG_LEVEL");
  return logLevel;
}

const log = new Log();
Object.freeze(log);
export default log;