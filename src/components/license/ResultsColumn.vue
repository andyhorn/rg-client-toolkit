<template>
  <div>
    <h5>{{ title }}</h5>
    <b-list-group :ref="ref"> </b-list-group>
  </div>
</template>

<script>
export default {
  name: "ResultsColumn",
  props: ["title", "ref"]
};
</script>

<style scoped></style>
