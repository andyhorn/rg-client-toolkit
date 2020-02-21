<template>
    <b-container class="pt-5" id="port-scan">
        <b-row>
            <b-col>
                <h3>Port Scanner</h3>
                <p>Enter your RLM server's IP, Hostname, or URL along with the three TCP ports listed below (the defaults are already filled).</p>
            </b-col>
        </b-row>
        <b-row>
            <PortScanForm :hostValue="this.$route.query.host" :rlmPortValue="this.$route.query.port"/>
        </b-row>
    </b-container>
</template>

<script>
import PortScanForm from '../components/ports/PortScanForm'

export default {
    name: 'PortScan',
    components: {
        PortScanForm
    },
    mounted() {
        let params = this.$route.query
        console.log('query:')
        console.log(params)
        if (params) {
            if (params.host) {
                this.host = params.host
            }
            if (params.port) {
                this.rlmPort = params.port
            }
        }


    }
}
</script>

<style scoped>
    #port-scan {
        margin-top: 1rem;
    }
</style>