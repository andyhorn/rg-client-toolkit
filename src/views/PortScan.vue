<template>
    <div class="container">
        <h4>Port Scanner</h4>
        <p>Enter your RLM server's IP, Hostname, or URL along with the three TCP ports listed below (the defaults are already filled).</p>
        <PortScanForm :hostValue="this.$route.query.host" :rlmPortValue="this.$route.query.port"/>
    </div>
</template>

<script>
import PortScanForm from '../components/PortScanForm'

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
    h1 {
        text-align: center;
    }
    ul {
        padding-left: 15px;
    }
    table {
        font-size: 0.9rem;
    }
    tr, th, td {
        border: none;
    }
</style>