<template>
  <div>
    <b-button @click="this.clean" size="lg" variant="primary"
      >Remove Serials</b-button
    ><br />
    <span>* requires administrative rights</span>
  </div>
</template>

<script>
import Log from "../../utils/log";
const log = new Log();

export default {
  name: "SerialRemovalForm",
  methods: {
    clean() {
      log.debug("[SerialRemovalForm] clean button clicked");
      this.$emit("clean");
    }
  }
};
</script>

<style scoped></style>
