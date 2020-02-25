<template>
  <b-container class="pt-5">
    <b-row>
      <b-col>
        <h3>Other Options</h3>
        <p>
          Manage your miscellaneous options on this machine, including toggling
          client logging and the "Render Only" status.
        </p>
      </b-col>
    </b-row>
    <b-row class="flex">
      <div>
        <h5>Render Only</h5>
        <OptionsSwitch
          :isSet="this.isRenderOnly"
          v-on:valueChanged="this.setRenderOnly"
        />
      </div>
      <div>
        <h5>Client Logging</h5>
        <OptionsSwitch
          :isSet="this.hasClientLogging"
          v-on:valueChanged="this.setClientLogging"
        />
      </div>
    </b-row>
  </b-container>
</template>

<script>
import OptionsSwitch from "../components/other/OptionsSwitch.vue";
import path from "path";
import fs from "fs";
import log from "../utils/log";

function getOptionsFilePath() {
  log.verbose("[Options] generating executable path for current platform...");
  if (process.platform == "win32") {
    log.verbose("[Options] using Windows platform");
    return path.join("C:", "ProgramData", "Red Giant", "licenses");
  } else {
    log.verbose("[Options] using macOS/Unix/Linux platform");
    return path.join("Users", "Shared", "Red Giant", "licenses");
  }
}

export default {
  name: "Options",
  components: {
    OptionsSwitch
  },
  data() {
    return {
      isRenderOnly: false,
      hasClientLogging: false
    };
  },
  beforeMount() {
    log.debug("[Options.vue] reading options file before view mounts");
    this.readOptions();
  },
  methods: {
    setRenderOnly(val) {
      log.debug("[Options.vue] setting render only property to: " + val);
      this.isRenderOnly = val;
      log.debug("[Options.vue] updating file");
      this.updateFile();
    },
    setClientLogging(val) {
      log.debug(`[Options.vue] setting client logging to: ${val}`);
      this.hasClientLogging = val;
      log.debug("[Options.vue] updating file");
      this.updateFile();
    },
    updateFile() {
      log.verbose("[Options] updating options file");
      let filename = path.join(getOptionsFilePath(), "rlm-options.txt");
      log.debug(`[Options.vue] filename: ${filename}`);
      let data = "";

      log.verbose("[Options] generating file data...");
      if (this.isRenderOnly && this.hasClientLogging) {
        data = "REDGIANT_RENDER_ONLY=true\nREDGIANT_ENTERPRISE_LOGGING=true";
      } else if (this.isRenderOnly) {
        data = "REDGIANT_RENDER_ONLY=true";
      } else if (this.hasClientLogging) {
        data = "REDGIANT_ENTERPRISE_LOGGING=true";
      }
      log.debug("[Options.vue] file data:");
      log.debug(data);

      log.debug("[Options.vue] writing data to file");
      fs.writeFileSync(filename, data);
    },
    readOptions() {
      log.verbose("[Options] reading file data...");
      let filename = path.join(getOptionsFilePath(), "rlm-options.txt");
      log.debug(`[Options.vue] filename: ${filename}`);

      if (fs.existsSync(filename)) {
        log.verbose("[Options] file found, reading...");
        let data = fs.readFileSync(filename, {
          encoding: "utf-8"
        });
        log.debug("[Options.vue] file data:");
        log.debug(data);

        for (let line of data.split("\n")) {
          if (line.includes("REDGIANT_ENTERPRISE_LOGGING")) {
            this.hasClientLogging = line.endsWith("true");
          }
          if (line.includes("REDGIANT_RENDER_ONLY")) {
            this.isRenderOnly = line.endsWith("true");
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.flex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.flex > div {
  margin: 0 auto;
  text-align: center;
}
</style>
