<template>
    <div id="port-scan-form">
        <form @submit="scanPorts" class="col s12">
            <PortScanTextInput v-bind:values="this.host" />
            <PortScanTextInput v-bind:values="this.ports[0]" />
            <PortScanTextInput v-bind:values="this.ports[1]" />
            <PortScanTextInput v-bind:values="this.ports[2]" />
            <button class="btn waves-effect">Scan!</button>
        </form>
    </div>
</template>

<script>
import PortScanTextInput from '../components/PortScanTextInput'
const Net = require('net')
const url = require('url')

export default {
    name: 'PortScanForm',
    components: {
        PortScanTextInput
    },
    data() {
        return {
            host: {
                title: 'Server Address',
                value: null,
                required: true
            },
            ports: [
                {
                    name: 'rlmPort',
                    title: 'RLM Port',
                    value: '5053',
                    success: null
                },
                {
                    name: 'webPort',
                    title:'Web GUI Port',
                    value: '5054',
                    success: null
                },
                {
                    name: 'isvPort',
                    title: 'ISV Port',
                    value: null,
                    success: null
                }
            ]
        }
    },
    methods: {
        scanPorts(e) {
            e.preventDefault()

            for (let port of this.ports) {
                let value = port.value

                if (value == null) {
                    return
                }

                let host = url.parse(this.host.value).host

                if (host == null) {
                    host = this.host.value
                } else {
                    this.host.value = host
                }

                let socket = new Net.Socket()

                socket.setTimeout(1500)

                socket.on('connect', () => {
                    socket.end()
                    port.success = true
                })

                socket.on('timeout', () => {
                    socket.end()
                    port.success = false
                })

                socket.on('error', () => {
                    socket.end()
                    port.success = false
                })

                socket.connect(port.value, host)
            }
        }
    }
}
</script>

<style scoped>
    
</style>