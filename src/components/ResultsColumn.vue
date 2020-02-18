<template>
    <div>
        <h5>{{ title }}</h5>
        <ul class="collection" v-bind:ref="ref">

        </ul>
    </div>
</template>

<script>
export default {
    name: 'ResultsColumn',
    props: ['title', 'ref']
}
</script>

<style scoped>

</style>