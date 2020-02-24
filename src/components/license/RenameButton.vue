<template>
  <b-button @click="fix" variant="success">Fix!</b-button>
</template>

<script>
import fs from "fs";

export default {
  name: "ConfigFixButton",
  props: ["oldPath", "newPath"],
  methods: {
    fix() {
      console.log("fix button clicked!");
      console.log(`old path: ${this.oldPath}`);
      console.log(`new path: ${this.newPath}`);
      fs.renameSync(this.oldPath, this.newPath);
      this.$emit("renameComplete");
    }
  }
};
</script>

<style scoped></style>
