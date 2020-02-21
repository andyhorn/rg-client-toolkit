<template>
    <b-list-group-item class="my-1 border border-dark rounded">
        <p class="m-0" v-bind:class="color"><i class="material-icons left">{{ icon }}</i>{{ text }}</p>
    </b-list-group-item>
</template>

<script>
export default {
    name: 'ScanResult',
    props: ['text', 'color', 'icon', 'showButton']    
}
</script>

<style scoped>

</style>