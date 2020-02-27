<template>
  <div class="d-flex flex-row-reverse align-items-center">
    <b-button @click="fix" variant="success" class="float-right">Fix!</b-button>
    <p v-if="error" class="text-danger m-0 p-0 pr-2">{{ error }}</p>
  </div>
</template>

<script>
// import fs from "fs";
import log from "../../utils/log";
import { rename } from "../../utils/file";

export default {
  name: "ConfigFixButton",
  props: ["oldPath", "newPath"],
  data() {
    return {
      error: null
    }
  },
  methods: {
    fix() {
      log.verbose("[RenameButton] button click detected");
      log.debug(`[RenameButton.vue] old path: ${this.oldPath}`);
      log.debug(`[RenameButton.vue] new path: ${this.newPath}`);
      log.verbose("[RenameButton] renaming file...");
      try {
        // fs.renameSync(this.oldPath, this.newPath);
        rename(this.oldPath, this.newPath);
        log.verbose("[RenameButton] rename complete!");
        this.$emit("renameComplete");
      } catch (e) {
        log.error("RenameButton.vue] unable to rename directory, error:");
        if (e.code == "EBUSY") {
          this.error = "Error: Close open files, then try again.";
        }
      }
    }
  }
};
</script>

<style scoped></style>
