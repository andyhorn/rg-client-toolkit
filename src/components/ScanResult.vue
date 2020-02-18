<template>
    <li class="collection-item">
        <p class="mx-auto" v-bind:class="color">{{ text }}</p>
    </li>
</template>

<script>
export default {
    name: 'ScanResult',
    props: ['text', 'color']    
}
</script>

<style scoped>
    .collection-item p {
        margin: 0;
    }
</style>