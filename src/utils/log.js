import fs from "fs";
import path from "path";
import getAppDataPath from "appdata-path";
const { remote } = require("electron");

const levels = ["NONE", "INFO", "VERBOSE", "DEBUG"];
const LOG_PATH = path.join(getAppDataPath(), "Red Giant Toolkit", "Logs");
const INTERVAL = 10;
const FILE_WRITE_OPTIONS = {
  encoding: "utf-8",
  flag: "a"
};

class Queue {
  constructor() {
    this.queue = [];
  }

  add(item) {
    this.queue.push(item);
  }

  run() {
    setInterval(this.process.bind(this), INTERVAL);
  }

  process() {
    if (this.queue && this.queue.length) {
      let item = this.queue.shift();
      if (console) {
        if (item.level == "warning") {
          console.warn(item.data);
        } else if (item.level == "error") {
          console.error(item.data);
        } else {
          console.log(item.data);
        }
      }
      fs.writeFileSync(item.filename, item.data + "\n", FILE_WRITE_OPTIONS);
    }
  }
}

class QueueItem {
  constructor(filename, data, level) {
    this.filename = filename;
    this.data = data;
    this.level = level;
  }
}

class Log {
  constructor() {
    if (!Log.instance) {
      Log.instance = this;
      this.queue = new Queue();
      this.queue.run();
      this.level = () => {
        let level = getLogLevel();
        return levelToInt(level);
      };
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

  toQueueItem(message, level) {
    let filepath = LOG_PATH;
    let filename;
    if (level == "warning") {
      filename = path.join(filepath, "warning.log");
    } else if (level == "error") {
      filename = path.join(filepath, "error.log");
    } else {
      filename = path.join(filepath, "log.log");
    }

    let item = new QueueItem(filename, message, level);
    return item;
  }

  print(level, message) {
    if (this.level() < levelToInt(level)) {
      return;
    }

    if (typeof message == "string") {
      message = `[${this.getTime()}] [${level}] ${message}`;
    }

    let item = this.toQueueItem(message, level);
    this.queue.add(item);
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
    this.print("warning", message);
  }

  error(message) {
    this.print("error", message);
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
