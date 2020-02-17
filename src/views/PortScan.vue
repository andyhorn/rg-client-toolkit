<template>
    <div class="container">
        <h1>Port Scanner</h1>
        <div class="row">
            <PortScanForm />
        </div>
        <div class="divider"/>
        <div class="row">
            <PortScanHelp />
        </div>
    </div>
</template>

<script>
import PortScanForm from '../components/PortScanForm'
import PortScanHelp from '../components/PortScanHelp'

export default {
    name: 'PortScan',
    components: {
        PortScanForm,
        PortScanHelp
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