<template>
  <b-container class="pt-5">
    <h3>License Creator</h3>
    <p>
      Use this tool to generate a new "client license file" to point your
      machines to your RLM server.
    </p>
    <LicenseCreationForm />
  </b-container>
</template>

<script>
import LicenseCreationForm from "../components/create/LicenseCreationForm.vue";

export default {
  name: "LicenseCreator",
  components: {
    LicenseCreationForm
  }
};
</script>

<style scoped></style>
