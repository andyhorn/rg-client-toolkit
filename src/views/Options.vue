<template>
  <b-container class="pt-5">
    <b-row>
      <b-col>
        <h3>Other Options</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-list-group>
          <b-list-group-item v-bind:class="isRenderOnly ? 'shadow my-2' : ''">
            <h5>Render Only Machine</h5>
            <OptionsSwitch
              :isSet="this.isRenderOnly"
              v-on:valueChanged="this.setRenderOnly"
            />
          </b-list-group-item>
          <b-list-group-item
            v-bind:class="ignoreFlags.universe ? 'shadow my-2' : ''"
          >
            <h5>Ignore Universe Subscription</h5>
            <OptionsSwitch
              :isSet="this.ignoreFlags.universe"
              v-on:valueChanged="this.setIgnoreUniverse"
            />
          </b-list-group-item>
          <b-list-group-item
            v-bind:class="ignoreFlags.complete ? 'shadow my-2' : ''"
          >
            <h5>Ignore Red Giant Complete Subscription</h5>
            <OptionsSwitch
              :isSet="this.ignoreFlags.complete"
              v-on:valueChanged="this.setIgnoreComplete"
            />
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import OptionsSwitch from "../components/other/OptionsSwitch.vue";
import path from "path";
import fs from "fs";
import log from "../utils/log";

export default {
  name: "Options",
  components: {
    OptionsSwitch
  },
  data() {
    return {
      isRenderOnly: false,
      hasClientLogging: false,
      ignoreFlags: {
        complete: false,
        universe: false
      },
      optionsFilePath: process.platform == "win32"
        ? path.join("C:", "ProgramData", "Red Giant", "licenses", "rlm-options.txt")
        : path.join(path.sep, "Users", "Shared", "Red Giant", "licenses", "rlm-options.txt"),
      exclusionFilePath:
        process.platform == "win32"
          ? path.join(
              "C:",
              "ProgramData",
              "Red Giant",
              "Red Giant Service",
              "SubscriptionExclusions.txt"
            )
          : path.join(
              path.sep,
              "Users",
              "Shared",
              "Red Giant",
              "Red Giant Service",
              "SubscriptionExclusions.txt"
            )
    };
  },
  beforeMount() {
    log.debug("[Options.vue] reading options file before view mounts");
    this.readOptions();
    this.readExclusions();
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
    setIgnoreUniverse(val) {
      log.debug(`[Options.vue] setting universe ignore to: ${val}`);
      this.ignoreFlags.universe = val;
      log.debug("[Options.vue] updating exclusions file");
      this.updateExclusions();
    },
    setIgnoreComplete(val) {
      log.debug(`[Options.vue] setting complete ignore to: ${val}`);
      this.ignoreFlags.complete = val;
      log.debug("[Options.vue] updating exclusions file");
      this.updateExclusions();
    },
    updateFile() {
      log.verbose("[Options] updating options file");
      log.debug(`[Options.vue] filename: ${this.optionsFilePath}`);
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
      fs.writeFileSync(this.optionsFilePath, data);
    },
    readOptions() {
      log.verbose("[Options] reading file data...");
      log.debug(`[Options.vue] filename: ${this.optionsFilePath}`);

      if (fs.existsSync(this.optionsFilePath)) {
        log.verbose("[Options] file found, reading...");
        let data = fs.readFileSync(this.optionsFilePath, {
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
    },
    updateExclusions() {
      if (
        this.ignoreFlags.universe == false &&
        this.ignoreFlags.complete == false
      ) {
        fs.unlinkSync(this.exclusionFilePath);
      } else if (this.ignoreFlags.universe && this.ignoreFlags.complete) {
        let data = "redgiant.stream.universe\nredgiant.stream.complete";
        fs.writeFileSync(this.exclusionFilePath, data, {
          encoding: "utf-8"
        });
      } else if (this.ignoreFlags.complete) {
        let data = "redgiant.stream.complete";
        fs.writeFileSync(this.exclusionFilePath, data, {
          encoding: "utf-8"
        });
      } else if (this.ignoreFlags.universe) {
        let data = "redgiant.stream.universe";
        fs.writeFileSync(this.exclusionFilePath, data, {
          encoding: "utf-8"
        });
      }
    },
    readExclusions() {
      if (fs.existsSync(this.exclusionFilePath)) {
        let data = fs.readFileSync(this.exclusionFilePath, {
          encoding: "utf-8"
        });

        let lines = data.split("\n");
        for (let line of lines) {
          if (line == "redgiant.stream.complete") {
            this.ignoreFlags.complete = true;
          } else if (line == "redgiant.stream.universe") {
            this.ignoreFlags.universe = true;
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.list-group-item {
  margin: 5px 0;
  transition: all 0.25s;
}
</style>
