<template>
    <div class="button-box">
        <button @click="this.testMe" v-bind:data-host="host" v-bind:data-port="port" class="btn btn-small waves-effect">Test</button>    
    </div>
</template>

<script>
export default {
    name: 'LicenseTestButton',
    props: ['host', 'port'],
    methods: {
        testMe() {
            let data = { host: this.host, port: this.port }
            this.$emit('testLicense', data)
        }
    }
}
</script>

<style scoped>
    .button-box {
        margin: 10px;
    }
</style>