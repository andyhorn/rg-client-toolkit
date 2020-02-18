<template>
    <div class="button-box">
        <button v-bind:data-host="host" v-bind:data-port="port" class="btn btn-small waves-effect">Test</button>    
    </div>
</template>

<script>
export default {
    name: 'LicenseTestButton',
    props: ['host', 'port']
}
</script>

<style scoped>
    .button-box {
        margin: 10px;
    }
</style>