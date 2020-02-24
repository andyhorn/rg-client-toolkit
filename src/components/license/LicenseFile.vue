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
              v-on:renameComplete="reScan"
            />
          </div>
        </b-td>
      </b-tr>
    </b-table-simple>
    <div class="buttons">
      <LicenseTestButton
        v-on:testLicense="this.testLicense"
        v-bind:host="license.host"
        v-bind:port="license.port"
      />
    </div>
  </b-list-group-item>
</template>

<script>
import LicenseTestButton from "./LicenseTestButton.vue";
import RenameButton from "./RenameButton.vue";
import path from "path";
import Log from "../../utils/log";
const log = new Log();

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
    log.debug("[LicenseFile.vue] view mounted");
    let isConfig = path.extname(this.license.name) == ".config";
    log.verbose(
      isConfig
        ? "[LicenseFile] Config file detected"
        : "[LicenseFile] proper lic file detected"
    );

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
    reScan() {
      log.verbose(
        "[LicenseFile] rename complete event caught, emitting rescan event"
      );
      this.$emit("rescan");
    },
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
