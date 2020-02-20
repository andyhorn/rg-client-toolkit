<template>
    <b-list-group-item class="m-0">
        <p class="m-0" v-bind:class="color"><i class="material-icons left">{{ icon }}</i>{{ text }}</p>
    </b-list-group-item>
</template>

<script>
export default {
    name: 'ScanResult',
    props: ['text', 'color', 'icon']    
}
</script>

<style scoped>

</style>