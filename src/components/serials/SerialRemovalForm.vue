<template>
  <div>
    <b-button @click="this.clean" variant="primary">Remove Serials</b-button
    ><br />
    <span>* requires administrative rights</span>
  </div>
</template>

<script>
import log from "../../utils/log";

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

<style scoped>
span {
  font-size: 0.9rem;
}
</style>
