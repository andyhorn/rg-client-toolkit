<template>
  <b-list-group-item class="m-0 my-1 p-0 border border-dark rounded">
    <b-table-simple>
      <b-tr>
        <b-th>File</b-th>
        <b-td>{{ license.name }}</b-td>
      </b-tr>
      <b-tr>
        <b-th>Address</b-th>
        <b-td>{{ license.host }}</b-td>
      </b-tr>
      <b-tr>
        <b-th>RLM Port</b-th>
        <b-td>{{ license.port }}</b-td>
      </b-tr>
      <b-tr v-if="this.configWarning">
        <b-th>Warnings</b-th>
        <b-td>
          <div class="warning-content">
            License file ends with '.config' extension, please change to '.lic'
            extension
            <RenameButton
              :oldPath="licenseFrom"
              :newPath="licenseTo"
              @renameComplete="reScan"
            />
          </div>
        </b-td>
      </b-tr>
    </b-table-simple>
    <div class="buttons">
      <LicenseTestButton
        @testLicense="this.testLicense"
        :host="license.host"
        :port="license.port"
      />
    </div>
  </b-list-group-item>
</template>

<script>
import LicenseTestButton from "./LicenseTestButton.vue";
import RenameButton from "./RenameButton.vue";
import path from "path";
import log from "../../utils/log";

export default {
  name: "LicenseFile",
  props: ["license", "isCaps"],
  components: {
    LicenseTestButton,
    RenameButton
  },
  data() {
    return {
      configWarning: false,
      licenseFrom: null,
      licenseTo: null
    };
  },
  mounted() {
    // Check if the license file is a .lic file or .config file
    log.debug("[LicenseFile.vue] view mounted");
    let isConfig = path.extname(this.license.name) == ".config";
    log.verbose(
      isConfig
        ? "[LicenseFile] Config file detected"
        : "[LicenseFile] proper lic file detected"
    );

    // If the file ends with .config, prepare for possible rename
    if (isConfig) {
      log.debug("[LicenseFile.vue] setting license rename parameters");
      this.configWarning = true;
      this.licenseFrom = this.license.fullPath;
      this.licenseTo = this.changeExtension(
        this.licenseFrom,
        ".config",
        ".lic"
      );

      log.debug(`[LicenseFile.vue] license path from: ${this.licenseFrom}`);
      log.debug(`[LicenseFIle.vue] license path to: ${this.licenseTo}`);
    }
  },
  methods: {
    // Change the extension on the file
    changeExtension(oldPath, oldExtension, newExtension) {
      log.debug("[LicenseFile.vue] changing extension...");
      log.debug(`[LicenseFile.vue] oldPath: ${oldPath}`);
      log.debug(`[LicenseFile.vue] oldExtension: ${oldExtension}`);
      log.debug(`[LicenseFile.vue] newExtension: ${newExtension}`);

      let noExtension = oldPath.slice(0, oldPath.indexOf(oldExtension));
      log.debug(`[LicenseFile.vue] no extension: ${noExtension}`);

      let newPath = noExtension + newExtension;
      log.debug(`[LicenseFile.vue] new path: ${newPath}`);

      return newPath;
    },
    // Emits a "rescan" event to automatically update the data displayed
    // to the user
    reScan() {
      log.verbose(
        "[LicenseFile] rename complete event caught, emitting rescan event"
      );
      this.$emit("rescan");
    },
    // Emits a "test license" event to transfer the license data over to the
    // port scan utility
    testLicense(data) {
      log.verbose("[LicenseFile] test button clicked");
      log.debug(`[LicenseFile.vue] license data:`);
      log.debug(data);
      this.$emit("testLicense", data);
    }
  }
};
</script>

<style scoped>
.warning-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
