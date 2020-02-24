<template>
  <b-button @click="fix" variant="success">Fix!</b-button>
</template>

<script>
import fs from "fs";
import Log from "../../utils/log";
const log = new Log();

export default {
  name: "ConfigFixButton",
  props: ["oldPath", "newPath"],
  methods: {
    fix() {
      log.verbose("[RenameButton] button click detected");
      log.debug(`[RenameButton.vue] old path: ${this.oldPath}`);
      log.debug(`[RenameButton.vue] new path: ${this.newPath}`);
      log.verbose("[RenameButton] renaming file...");
      fs.renameSync(this.oldPath, this.newPath);
      log.verbose("[RenameButton] rename complete!");
      this.$emit("renameComplete");
    }
  }
};
</script>

<style scoped></style>
