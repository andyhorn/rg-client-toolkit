<template>
  <div id="license-form">
    <b-form>
      <b-row>
        <b-col>
          <b-form-input
            type="text"
            v-model="host"
            autofocus
            required
          ></b-form-input>
          <label class="active">Server Address</label>
        </b-col>
        <b-col>
          <b-form-input type="text" v-model="port" required></b-form-input>
          <label class="active">RLM Port</label>
        </b-col>
        <b-col cols="12">
          <b-button variant="primary" @click="save" class="btn"
            >Save</b-button
          >
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import path from "path";
import { write } from "../../utils/file";
const { dialog } = require("electron").remote;
import log from "../../utils/log";

export default {
  name: "LicenseCreationForm",
  data() {
    return {
      host: null,
      port: "5053",
      platform: process.platform,
      licenseDirPath:
        process.platform == "win32"
          ? path.join("C:", "ProgramData", "Red Giant", "licenses")
          : path.join(path.sep, "Users", "Shared", "Red Giant", "licenses")
    };
  },
  methods: {
    save() {
      log.info("[LicenseCreationForm] saving license...");
      let data = `HOST ${this.host} ANY ${this.port}`;
      let filename = "redgiant-client.primary.lic";
      let defaultPath = path.join(this.licenseDirPath, filename);

      log.debug(`[LicenseCreationForm.vue] data string: ${data}`);
      log.debug(`[LicenseCreationForm.vue] default path: ${defaultPath}`);

      let chosenPath = dialog.showSaveDialogSync({
        title: "Save License File",
        defaultPath: defaultPath
      });

      if (chosenPath) {
        log.info("[LicenseCreationForm] license saved!");
        log.debug(`[LicenseCreationForm.vue] path chosen: ${chosenPath}`);
        write(chosenPath, data);
        log.verbose(`[LicenseCreationForm] file write completed`);
      } else {
        log.info("[LicenseCreationForm] license save canceled");
      }
    }
  }
};
</script>

<style scoped>
#license-form {
  margin-top: 1.5rem;
}
</style>
