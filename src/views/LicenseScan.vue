<template>
    <div class="container">
        <div class="row">
            <div class="col s12">
                <h3>License Scanner</h3>
                <p>Use this tool to ensure your machine is properly set up with the client license file.</p>
            </div>
        </div>
        <div class="row">
            <div class="col s12">
                <p>This file must be located in the correct folder to work:</p>
                <ul>
                    <li><strong>Windows:</strong> C:\ProgramData\Red Giant\licenses</li>
                    <li><strong>Mac:</strong> /Users/Shared/Red Giant/licenses</li>
                </ul>
            </div>
        </div>
        <LicenseScanner v-on:testLicense="this.testLicense" />
    </div>
</template>

<script>
import LicenseScanner from '../components/LicenseScanner.vue'

export default {
    name: 'LicenseScan',
    components: {
        LicenseScanner
    },
    methods: {
        testLicense(data) {
            let host = data.host
            let port = data.port
            this.$router.push(`/scan?host=${host}&port=${port}`)
        } 
    }
}
</script>

<style scoped>

</style>