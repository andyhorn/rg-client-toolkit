<template>
  <b-container class="pt-5">
    <b-row>
      <b-col>
        <h3>Serial Management</h3>
      </b-col>
    </b-row>
    <b-row class="pt-5">
      <b-col>
        <h4>Serial Exclusions</h4>
        <p>
          Serials registered through the Red Giant Application Manager cannot be
          removed, but they can be added to an exclusion list. Any serials
          appearing in the form below will not be used by Red Giant Application
          Manager.
        </p>
        <SerialExclusionForm />
      </b-col>
    </b-row>
    <b-row class="pt-5">
      <b-col>
        <h4>Serial Removal</h4>
        <p>
          Serials installed prior to Red Giant Application Manager can be
          removed from the system.<br />
          <strong>Note:</strong> This will remove <em>all</em> Red Giant serials
          installed prior to Red Giant App.
        </p>
        <SerialRemovalForm class="mx-auto" v-on:clean="this.clean" />
      </b-col>
    </b-row>

    <b-row class="pt-3">
      <b-col>
        <SerialRemovalResults
          v-bind:platform="this.platform"
          v-bind:status="this.status"
          v-bind:success="this.success"
          v-if="this.display"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import SerialRemovalForm from "../components/serials/SerialRemovalForm.vue";
import SerialRemovalResults from "../components/serials/SerialRemovalResults.vue";
import SerialExclusionForm from "../components/serials/SerialExclusionForm.vue";

import path from "path";
const sudo = require("sudo-prompt");
import log from "../utils/log";

function getPlatform() {
  return process.platform;
}

function pathToUtil() {
  let platform = getPlatform();
  let fileLoc;
  if (platform == "win32") {
    fileLoc =
      process.env.NODE_ENV != "production"
        ? path.join(__static, "bin", "rgdeploy.exe")
        : path.join(__static, "..", "rgdeploy.exe");

    log.verbose("[SerialRemoval] generating executable path for Windows");
  } else {
    fileLoc =
      process.env.NODE_ENV != "production"
        ? path.join(__static, "bin", "rgdeploy")
        : path.join(__static, "..", "rgdeploy");
    log.verbose("[SerialRemoval] generating executable path for Unix/macOS");
  }
  return fileLoc;
}

export default {
  name: "SerialRemoval",
  components: {
    SerialRemovalForm,
    SerialRemovalResults,
    SerialExclusionForm
  },
  data() {
    return {
      platform: null,
      status: null,
      success: null,
      display: false
    };
  },
  mounted() {
    log.debug("[SerialRemoval.vue] mounted");
    if (process.platform == "win32") {
      log.debug("[SerialRemoval.vue] setting platform as Windows");
      this.platform = "Windows";
    } else if (process.platform == "darwin") {
      log.debug("[SerialRemoval.vue] setting platform as macOS X");
      this.platform = "macOS";
    }
  },
  methods: {
    clean() {
      log.info("[SerialRemoval] cleaning...");

      let command = `"${pathToUtil()}" --removeserials`;
      if (getPlatform() != "win32") {
        command = `chmod 777 "${pathToUtil()}" && ` + command;
      }

      log.debug(`[SerialRemoval.vue] executable command: ${command}`);
      this.status = "Running...";
      this.display = true;

      log.verbose("[SerialRemoval] execting command");
      sudo.exec(
        command,
        {
          name: "Red Giant Client Toolkit"
        },
        (err, stdout, stderr) => {
          if (err || stderr) {
            log.info("[SerialRemoval] execution failed");
            this.status = "Failed";
            if (err) {
              log.error("[SerialRemoval] fatal error:");
              log.error(err);
            }
            if (stderr) {
              log.error("[SerialRemoval] error:");
              log.error(stderr);
            }
          } else {
            this.status = "Success!";
            log.info("[SerialRemoval] execution successful");
            if (stdout) {
              log.verbose(`[SerialRemoval] execution output:`);
              log.verbose(stdout);
            }
          }
        }
      );
    }
  }
};
</script>

<style scoped></style>
