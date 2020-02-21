<template>
    <b-table-simple>
        <b-tr>
            <b-th>Platform</b-th>
            <b-td>{{ platform }}</b-td>
        </b-tr>
        <b-tr>
            <b-th>Status</b-th>
            <b-td>{{ status }}</b-td>
        </b-tr>
    </b-table-simple>
</template>

<script>
export default {
    name: 'SerialRemovalResults',
    props: ['platform', 'status', 'success']
}
</script>

<style scoped>

</style>