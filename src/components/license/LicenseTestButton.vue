<template>
  <div class="button-box">
    <b-button
      @click="this.testMe"
      v-bind:data-host="host"
      v-bind:data-port="port"
      variant="primary"
      >Test License</b-button
    >
  </div>
</template>

<script>
import log from "../../utils/log";

export default {
  name: "LicenseTestButton",
  props: ["host", "port"],
  methods: {
    testMe() {
      log.verbose("[LicenseTestButton] button click detected");
      let data = { host: this.host, port: this.port };
      log.debug("[LicenseTestButton.vue] data:");
      log.debug(data);
      this.$emit("testLicense", data);
    }
  }
};
</script>

<style scoped>
.button-box {
  margin: 10px;
}
</style>
