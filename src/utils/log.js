const DEFAULT_LOG_LEVEL = "debug";
const levels = ["NONE", "LOG", "INFO", "VERBOSE", "DEBUG"];
function getLevel(level) {
  level = level.toUpperCase();
  if (!levels.includes(level)) {
    return -1;
  } else {
    return levels.indexOf(level);
  }
}

module.exports = class Log {
  constructor() {
    this.level = getLevel(process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL);
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

  print(level, message) {
    this.checkLevel();

    if (this.level < levels.indexOf(level)) {
      return;
    }

    if (typeof message == "string") {
      message = `[${level}] ${this.addTimestamp(message)}`;
    }

    console.log(message);
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

    console.warn(message);
  }

  error(message) {
    if (this.level == 0) {
      return;
    }

    message = this.addTimestamp(message);

    console.error(message);
  }
};
