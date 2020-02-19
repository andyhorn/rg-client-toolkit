<template>
    <div>
        <table>
            <tr>
                <th>Platform</th>
                <td>{{ platform }}</td>
            </tr>
            <tr>
                <th>Status</th>
                <td>{{ status }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: 'SerialRemovalResults',
    props: ['platform', 'status', 'success']
}
</script>

<style scoped>

</style>