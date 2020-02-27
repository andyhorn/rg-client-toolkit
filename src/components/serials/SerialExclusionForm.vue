<template>
  <div>
    <b-form @submit="addItem">
      <b-input-group>
        <b-input ref="serialNumber" type="text"></b-input>
        <b-button variant="primary" type="submit">Add</b-button>
      </b-input-group>
    </b-form>
    <b-list-group horizontal class="py-3">
      <ExcludedSerial
        v-for="item in serialList"
        v-bind:key="item.id"
        v-bind:serial="item.serial"
        v-bind:id="item.id"
        v-on:removeSerial="removeSerial"
        class="m-1"
      >
      </ExcludedSerial>
    </b-list-group>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import log from "../../utils/log";
import ExcludedSerial from "./ExcludedSerial.vue";

export default {
  name: "SerialExclusionForm",
  components: {
    ExcludedSerial
  },
  data() {
    return {
      serialList: [],
      exclusionFilePath: null,
      exclusionFileName: "SerialExclusions.txt",
      filePath: null
    };
  },
  mounted() {
    log.debug("[SerialExclusionForm.vue] view mounted");

    this.exclusionFilePath =
      process.platform == "win32"
        ? path.join("C:", "ProgramData", "Red Giant", "Red Giant Service")
        : path.join("Users", "Shared", "Red Giant", "Red Giant Service");
    log.debug(
      `[SerialExclusionForm.vue] file path set to: ${this.exclusionFilePath}`
    );

    this.filePath = path.join(this.exclusionFilePath, this.exclusionFileName);
    log.debug(`[SerialExclusionForm.vue] full file path: ${this.filePath}`);

    this.read();
  },
  methods: {
    read() {
      log.verbose("[SerialExclusionForm] looking for serial exclusion data...");
      if (fs.existsSync(this.filePath)) {
        log.verbose("[SerialExclusionForm] exclusion file found!");
        let fileData = fs.readFileSync(this.filePath, {
          encoding: "utf-8"
        });
        log.debug("[SerialExclusionForm.vue] exclusion file data:");
        log.debug(fileData);
        fileData = fileData.split("\n");

        log.debug("[SerialExclusionForm.vue] importing file data...");
        for (let line of fileData) {
          if (line.length) {
            log.debug(`[SerialExclusionForm.vue] item:`);
            let item = {
              serial: line,
              id: uuidv4()
            };
            log.debug(item);
            this.serialList.push(item);
          }
        }
      }
    },
    addItem(e) {
      e.preventDefault();
      log.info("[SerialExclusionForm] adding item to exclusion list...");

      let serial = this.$refs.serialNumber.$el.value;
      log.debug(`[SerialExclusionForm.vue] form data: ${serial}`);

      this.$refs.serialNumber.$el.value = "";
      let item = {
        serial,
        id: uuidv4()
      };
      log.debug("[SerialExclusionForm.vue] item created:");
      log.debug(item);

      this.serialList.push(item);
      this.updateFile();
      log.info("[SerialExclusionForm] item added!");
    },
    removeSerial(id) {
      log.info("[SerialExclusionForm] removing item from exclusion list...");
      this.serialList = this.serialList.filter(i => i.id != id);
      this.updateFile();
      log.info("[SerialExclusionForm] removed!");
    },
    updateFile() {
      log.verbose("[SerialExclusionForm] updating exclusion file...");
      let contents = this.serialList.map(i => i.serial).join("\n");
      log.debug("[SerialExclusionForm.vue] new file contents:");
      log.debug(contents);

      fs.writeFileSync(this.filePath, contents, {
        encoding: "utf-8"
      });
      log.verbose("[SerialExclusionForm] updated!");
    }
  }
};
</script>

<style scoped></style>
