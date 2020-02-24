<template>
  <div>
    <b-form-checkbox switch size="lg" ref="checkbox" v-model="checked">{{
      checked ? "ON" : "OFF"
    }}</b-form-checkbox>
  </div>
</template>

<script>
import Log from "../../utils/log";
const log = new Log();

export default {
  name: "OptionsSwitch",
  props: ["isSet"],
  data() {
    return {
      checked: this.isSet
    };
  },
  watch: {
    checked: function(val) {
      log.debug(`[OptionsSwitch.vue] checked value changed to: ${val}`);
      this.$emit("valueChanged", val);
    }
  }
};
</script>
