<template>
    <b-container class="pt-5">
        <b-row>
            <b-col>
                <h3>Serial Management</h3>
                <p>If you used serial numbers in the past and would like to remove them from this machine, click the button below.</p>
                <p>Note: This will not work with serials installed through the Red Giant Application Manager.</p>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <SerialRemovalForm
                    v-on:clean="this.clean" 
                />
            </b-col>
        </b-row>
        <b-row class="pt-3">
            <b-col>
                <SerialRemovalResults 
                    v-bind:platform="this.platform" 
                    v-bind:status="this.status" 
                    v-bind:success="this.success"
                    v-if="this.display"
                />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import SerialRemovalForm from '../components/SerialRemovalForm.vue'
import SerialRemovalResults from '../components/SerialRemovalResults.vue'
import path from 'path'
const sudo = require('sudo-prompt')

function getPlatform() {
    return process.platform
}

function pathToUtil() {
    let platform = getPlatform()
    if (platform == 'win32') {
        return path.join(process.cwd(), 'src', 'assets', 'bin', 'rgdeploy.exe')
    } else {
        return path.join(process.cwd(), 'src', 'assets', 'bin', 'rgdeploy')
    }
}

export default {
    name: 'SerialRemoval',
    components: {
        SerialRemovalForm,
        SerialRemovalResults
    },
    data() {
        return {
            platform: null,
            status: null,
            success: null,
            display: false
        }
    },
    mounted() {
        if (process.platform == 'win32') {
            this.platform = 'Windows'
        } else if (process.platform == 'darwin') {
            this.platform = 'macOS'
        }
    },
    methods: {
        clean() {
            console.log('cleaning...')
            let command = `"${pathToUtil()}" --removeserials`
            console.log(command)
            this.status = "Running..."
            this.display = true

            sudo.exec(command, {
                name: 'Red Giant Client Toolkit'
            }, (err, stdout, stderr) => {
                if (err || stderr) {
                    this.status = "Failed"
                    if (err) {
                        console.log('fatal error')
                        console.log(err)
                    }
                    if (stderr) {
                        console.log('process error')
                        console.log(stderr)
                    }
                } else {
                    this.status = "Success!"
                    if (stdout) {
                        console.log('success!')
                        console.log(stdout)
                    }
                }
            })
        }
    }
}
</script>

<style scoped>

</style>