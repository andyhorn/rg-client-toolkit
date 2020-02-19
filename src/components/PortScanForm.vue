<template>
    <div id="port-scan-form">
        <form @submit="scanPorts" class="col s12">
            <div class="row">
                <div class="col s12">
                    <PortScanTextInput v-bind:values="this.host" />
                </div>
            </div>
            <div class="row">
                <div class="col s4">
                    <PortScanTextInput v-bind:values="this.ports[0]" />
                </div>
                <div class="col s4">
                    <PortScanTextInput v-bind:values="this.ports[1]" />
                </div>
                <div class="col s4">
                    <PortScanTextInput v-bind:values="this.ports[2]" />
                </div>
            </div>
            <button class="btn waves-effect waves-light">Scan!</button>
            <div id="scanStatus"></div>
        </form>
    </div>
</template>

<script>
import PortScanTextInput from '../components/PortScanTextInput'
const Net = require('net')
const url = require('url')

const TIMEOUT = 5 * 1000

const scanStatusText = ['Scanning', 'Scanning.', 'Scanning..', 'Scanning...']
var scans = 0, scanStatusIndex = 0, interval

function startScanAnimation() {
    interval = setInterval(updateScanText, 100)
}

function updateScanText() {
    let scanStatusElement = document.getElementById('scanStatus')
    let text = `<p>${scanStatusText[scanStatusIndex]}</p>`
    scanStatusElement.innerHTML = text
    scanStatusIndex += 1

    if (scanStatusIndex == scanStatusText.length) {
        scanStatusIndex = 0
    }
}

function endScanAnimation() {
    if (scans == 0) {
        clearInterval(interval)
        document.getElementById('scanStatus').innerText = ''
    }
}

export default {
    name: 'PortScanForm',
    components: {
        PortScanTextInput
    },
    props: ['hostValue', 'rlmPortValue'],
    data() {
        return {
            host: {
                title: 'Server Address',
                value: this.hostValue,
                required: true
            },
            ports: [
                {
                    name: 'rlmPort',
                    title: 'RLM Port',
                    value: this.rlmPortValue || '5053',
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
            startScanAnimation()

            for (let port of this.ports) {
                let value = port.value
                port.success = null

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

                socket.setTimeout(TIMEOUT)

                socket.on('connect', () => {
                    socket.end()
                    port.success = true
                })

                socket.on('timeout', () => {
                    socket.destroy()
                    port.success = false
                })

                socket.on('error', () => {
                    socket.end()
                    port.success = false
                })

                socket.on('close', () => {
                    scans -=1
                    endScanAnimation()
                })

                scans += 1
                socket.connect(port.value, host)
            }
        }
    }
}
</script>

<style scoped>
    
</style>