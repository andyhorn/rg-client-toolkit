<template>
  <div>
    <b-form-checkbox switch size="lg" ref="checkbox" v-model="checked">{{
      checked ? "ON" : "OFF"
    }}</b-form-checkbox>
  </div>
</template>

<script>
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
      console.log(val);
      this.$emit("valueChanged", val);
    }
  }
};
</script>
