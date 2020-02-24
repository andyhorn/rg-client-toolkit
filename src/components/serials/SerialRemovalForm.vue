<template>
  <div>
    <b-button @click="this.clean" size="lg" variant="primary"
      >Remove Serials</b-button
    ><br />
    <span>* requires administrative rights</span>
  </div>
</template>

<script>
export default {
  name: "SerialRemovalForm",
  methods: {
    clean() {
      console.log("button clicked");
      this.$emit("clean");
    }
  }
};
</script>

<style scoped></style>
