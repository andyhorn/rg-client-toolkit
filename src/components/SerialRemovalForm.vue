<template>
    <div>
        <button @click="this.clean" class="btn btn-large waves-effect">Remove Serials</button><br/>
        <span>* requires administrative rights</span>
    </div>
</template>

<script>
export default {
    name: 'SerialRemovalForm',
    methods: {
        clean() {
            console.log('button clicked')
            this.$emit('clean')
        }
    }
}
</script>

<style scoped>

</style>