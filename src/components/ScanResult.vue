<template>
    <li class="collection-item">
        <p class="mx-auto" v-bind:class="color"><i class="material-icons left">{{ icon }}</i>{{ text }}</p>
    </li>
</template>

<script>
export default {
    name: 'ScanResult',
    props: ['text', 'color', 'icon']    
}
</script>

<style scoped>
    .collection-item p {
        margin: 0;
    }
</style>