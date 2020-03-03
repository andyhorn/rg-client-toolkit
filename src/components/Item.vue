<template>
  <b-list-group-item>
    <p>
      {{ data }}
      <b-icon-x class="icon" @click="remove"></b-icon-x>
    </p>
  </b-list-group-item>
</template>

<script>
export default {
  name: "Item",
  props: ["data", "id"],
  methods: {
    remove() {
      this.$emit("removeItem", this.id);
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
