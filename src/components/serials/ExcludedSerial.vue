<template>
  <b-list-group-item>
    <p>
      {{ this.serial }}
      <b-icon-x class="icon" @click="remove"></b-icon-x>
    </p>
  </b-list-group-item>
</template>

<script>
export default {
  name: "ExcludedSerial",
  props: ["serial", "id"],
  methods: {
    remove() {
      this.$emit("removeSerial", this.id);
    }
  }
};
</script>

<style scoped>
p {
  margin: 0;
  padding: 0;
}
.icon:hover {
  cursor: pointer;
}
</style>
