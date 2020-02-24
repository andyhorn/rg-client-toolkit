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
    let isConfig = path.extname(this.license.name) == ".config";
    console.log(isConfig ? "Config file detected" : "proper lic file detected");

    if (isConfig) {
      this.configWarning = true;
      this.licenseFrom = this.license.fullPath;
      this.licenseTo = this.changeExtension(
        this.licenseFrom,
        ".config",
        ".lic"
      );

      console.log(`oldPath: ${this.oldPath}`);
      console.log(`newPath: ${this.newPath}`);
    }
  },
  methods: {
    changeExtension(oldPath, oldExtension, newExtension) {
      let noExtension = oldPath.slice(0, oldPath.indexOf(oldExtension));
      console.log(`no extension: ${noExtension}`);

      let newPath = noExtension + newExtension;
      console.log(`new path: ${newPath}`);

      return newPath;
    },
    reScan() {
      console.log("rename complete event caught, emitting rescan event");
      this.$emit("rescan");
    },
    testLicense(data) {
      console.log("test button clicked");
      console.log(data);
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
