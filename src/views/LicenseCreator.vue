<template>
    <div class="container">
        <h3>License Creator</h3>
        <p>Use this tool to generate a new "client license file" to point your machines to your RLM server.</p>
        <LicenseCreationForm />
    </div>
</template>

<script>
import LicenseCreationForm from '../components/LicenseCreationForm.vue'

export default {
    name: 'LicenseCreator',
    components: {
        LicenseCreationForm
    }
}
</script>

<style scoped>

</style>