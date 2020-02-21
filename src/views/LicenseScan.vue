<template>
    <b-container class="pt-5">
        <b-row>
            <b-col>
                <h3>License Scanner</h3>
                <p>Use this tool to ensure your machine is properly set up with the client license file.</p>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <p>This file must be located in the correct folder to work:</p>
                <ul>
                    <li><strong>Windows:</strong> C:\ProgramData\Red Giant\licenses</li>
                    <li><strong>Mac:</strong> /Users/Shared/Red Giant/licenses</li>
                </ul>
            </b-col>
        </b-row>
            <LicenseScanner v-on:testLicense="this.testLicense" />
    </b-container>
</template>

<script>
import LicenseScanner from '../components/license/LicenseScanner.vue'

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