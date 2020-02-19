<template>
    <button @click="fix" class="btn btn-small waves-effect">Fix!</button>
</template>

<script>
import fs from 'fs'

export default {
    name: 'ConfigFixButton',
    props: ['oldPath', 'newPath'],
    methods: {
        fix() {
            console.log('fix button clicked!')
            console.log(`old path: ${this.oldPath}`)
            console.log(`new path: ${this.newPath}`)
            fs.renameSync(this.oldPath, this.newPath)
            this.$emit('renameComplete')
        }
    }
}
</script>

<style scoped>

</style>