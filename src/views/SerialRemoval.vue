<template>
  <b-container class="pt-5">
    <b-row>
      <b-col>
        <h3>Serial Management</h3>
        <p>
          There are two different methods of removing serial numbers from this system,
          depending on how the serial numbers were registered.
        </p>
      </b-col>
    </b-row>
    <b-row class="pt-5">
      <b-col>
        <h5 class="text-center">Red Giant Application Manager</h5>
        <p>
          These serials cannot be removed, but they can be ignored - Add these serial numbers to the 
          <strong>Serial Exclusion Form</strong> below.
        </p>
        <SerialExclusionForm />
      </b-col>
    </b-row>
    <b-row class="pt-5">
      <b-col>
        <h5 class="text-center">Suite Installer or License Panel</h5>
        <p>
          If you entered the serial numbers during the installation or through a licensing panel,
          you can use the button below to uninstall them.
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
    fileLoc = process.env.NODE_ENV != "production" 
      ? path.join(__static, "bin", "rgdeploy.exe")
      : path.join(__static, "..", "rgdeploy.exe");

    log.verbose("[SerialRemoval] generating executable path for Windows");
  } else {
    fileLoc = process.env.NODE_ENV != "production"
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
              log.error(err);
              // console.log("fatal error");
              // console.log(err);
            }
            if (stderr) {
              log.error(stderr);
              // console.log("process error");
              // console.log(stderr);
            }
          } else {
            this.status = "Success!";
            log.info("[SerialRemoval] execution successful");
            if (stdout) {
              log.verbose(`[SerialRemoval] execution output:`);
              log.verbose(stdout);
              // console.log("success!");
              // console.log(stdout);
            }
          }
        }
      );
    }
  }
};
</script>

<style scoped></style>
