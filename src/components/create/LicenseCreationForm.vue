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
          <b-button variant="primary" @click="this.save" class="btn"
            >Save</b-button
          >
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import fs from "fs";
import path from "path";
const { dialog } = require("electron").remote;

function getLicenseDirPath() {
  let platform = process.platform;
  if (platform == "win32") {
    return path.join("C:", "ProgramData", "Red Giant", "licenses");
  } else {
    return path.join("Users", "Shared", "Red Giant", "licenses");
  }
}

export default {
  name: "LicenseCreationForm",
  data() {
    return {
      host: null,
      port: "5053"
    };
  },
  methods: {
    save() {
      let data = `HOST ${this.host} ANY ${this.port}`;
      let filename = "redgiant-client.primary.lic";
      let defaultPath = path.join(getLicenseDirPath(), filename);

      let chosenPath = dialog.showSaveDialogSync({
        title: "Save License File",
        defaultPath: defaultPath
      });

      if (chosenPath) {
        fs.writeFileSync(chosenPath, data);
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
