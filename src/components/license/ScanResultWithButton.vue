<template>
  <b-list-group-item class="my-1 border border-dark rounded">
    <div
      class="d-flex flex-direction-row justify-content-between align-items-center p-0"
    >
      <p class="m-0 p-0" v-bind:class="color">
        <b-icon v-bind:icon="icon" class="h3"></b-icon>
        {{ text }}
      </p>
      <RenameButton
        :oldPath="from"
        :newPath="to"
        v-on:renameComplete="rescan"
      />
    </div>
  </b-list-group-item>
</template>

<script>
import RenameButton from "./RenameButton.vue";

export default {
  name: "ScanResult",
  props: ["text", "color", "icon", "from", "to"],
  components: {
    RenameButton
  },
  methods: {
    rescan() {
      this.$emit("rescan");
    }
  }
};
</script>

<style scoped></style>
