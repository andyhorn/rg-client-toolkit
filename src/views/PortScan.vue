<template>
    <div class="container">
        <h4>Port Scanner</h4>
        <p>Enter your RLM server's IP, Hostname, or URL along with the three TCP ports listed below (the defaults are already filled).</p>
            <PortScanForm />
    </div>
</template>

<script>
import PortScanForm from '../components/PortScanForm'
// import PortScanHelp from '../components/PortScanHelp'

export default {
    name: 'PortScan',
    components: {
        PortScanForm
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