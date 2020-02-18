<template>
    <li class="collection-item left-align">
        <table class="table-borderless">
            <tr>
                <th>File</th>
                <td>{{ license.name }}</td>
            </tr>
            <tr>
                <th>Address</th>
                <td>{{ license.host }}</td>
            </tr>
            <tr>
                <th>RLM Port</th>
                <td>{{ license.port }}</td>
            </tr>
        </table>
        <LicenseTestButton v-bind:host="license.host" v-bind:port="license.port" />
    </li>    
</template>

<script>
import LicenseTestButton from '../components/LicenseTestButton.vue'

export default {
    name: 'LicenseFile',
    props: ['license'],
    components: {
        LicenseTestButton
    }
}
</script>

<style scoped>

</style>