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

function getOptionsFilePath() {
  if (process.platform == "win32") {
    return path.join("C:", "ProgramData", "Red Giant", "licenses");
  } else {
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
    this.readOptions();
  },
  methods: {
    setRenderOnly(val) {
      console.log(`render only now set to: ${val}`);
      this.isRenderOnly = val;
      this.updateFile();
    },
    setClientLogging(val) {
      console.log(`client logging now set to: ${val}`);
      this.hasClientLogging = val;
      this.updateFile();
    },
    updateFile() {
      console.log("updating options file");
      let filename = path.join(getOptionsFilePath(), "rlm-options.txt");
      console.log(filename);
      let data = "";

      if (this.isRenderOnly && this.hasClientLogging) {
        data = "REDGIANT_RENDER_ONLY=true\nREDGIANT_ENTERPRISE_LOGGING=true";
      } else if (this.isRenderOnly) {
        data = "REDGIANT_RENDER_ONLY=true";
      } else if (this.hasClientLogging) {
        data = "REDGIANT_ENTERPRISE_LOGGING=true";
      }

      console.log("data:");
      console.log(data);

      fs.writeFileSync(filename, data);
    },
    readOptions() {
      console.log("reading options file");
      let filename = path.join(getOptionsFilePath(), "rlm-options.txt");

      if (fs.existsSync(filename)) {
        console.log("file exists");
        let data = fs.readFileSync(filename, {
          encoding: "utf-8"
        });
        console.log(data);
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
