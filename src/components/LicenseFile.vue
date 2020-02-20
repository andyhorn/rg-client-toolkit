<template>
    <b-list-group-item class="m-0 p-0">
        <b-table-simple>
            <b-tr>
                <b-th>File</b-th>
                <b-td>{{ license.name }}</b-td>
            </b-tr>
            <b-tr>
                <b-th>Address</b-th>
                <b-td>{{ license.host }}</b-td>
            </b-tr>
            <b-tr>
                <b-th>RLM Port</b-th>
                <b-td>{{ license.port }}</b-td>
            </b-tr>
            <b-tr v-if="this.isConfig">
                <b-th>Warnings</b-th>
                <b-td>
                    <div class="warning-content">
                        License file ends with '.config' extension, please change to '.lic' extension
                        <ConfigFixButton :oldPath="this.oldPath" :newPath="this.newPath" v-on:renameComplete="this.reScan" />
                    </div>
                </b-td>
            </b-tr>
        </b-table-simple>
        <div class="buttons">
            <LicenseTestButton v-on:testLicense="this.testLicense" v-bind:host="license.host" v-bind:port="license.port" />
        </div>
    </b-list-group-item>    
</template>

<script>
import LicenseTestButton from '../components/LicenseTestButton.vue'
import ConfigFixButton from '../components/ConfigFixButton.vue'

export default {
    name: 'LicenseFile',
    props: ['license'],
    components: {
        LicenseTestButton,
        ConfigFixButton
    },
    data() {
        return {
            isConfig: false,
            oldPath: null,
            newPath: null
        }
    },
    mounted() {
        let isConfig = this.license.name.endsWith('.config')
        console.log(isConfig ? 'Config file detected' : 'proper lic file detected')

        if (isConfig) {
            this.oldPath = this.license.name
            this.newPath = this.changeExtension(this.oldPath, '.config', '.lic')

            console.log(`oldPath: ${this.oldPath}`)
            console.log(`newPath: ${this.newPath}`)
        }

        this.isConfig = isConfig
    },
    methods: {
        changeExtension(oldPath, oldExtension, newExtension) {
            let noExtension = oldPath.slice(0, oldPath.indexOf(oldExtension))
            console.log(`no extension: ${noExtension}`)

            let newPath = noExtension + newExtension
            console.log(`new path: ${newPath}`)

            return newPath
        },
        reScan() {
            console.log('rename complete event caught, emitting rescan event')
            this.$emit('rescan')
        },
        testLicense(data) {
            console.log('test button clicked')
            console.log(data)
            this.$emit('testLicense', data)
        }
    }
}
</script>

<style scoped>
    .warning-content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
</style>