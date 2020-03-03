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
    };
  },
  methods: {
    // Attempts to rename the license file to end with ".lic"
    fix() {
      log.verbose("[RenameButton] button click detected");
      log.debug(`[RenameButton.vue] old path: ${this.oldPath}`);
      log.debug(`[RenameButton.vue] new path: ${this.newPath}`);
      log.verbose("[RenameButton] renaming file...");
      if (rename(this.oldPath, this.newPath)) {
        this.$emit("renameComplete");
      }
    }
  }
};
</script>

<style scoped></style>
