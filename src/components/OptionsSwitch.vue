<template>
    <div class="switch">
        <label>
            Off
            <input type="checkbox" ref="checkbox" @change="this.changed">
            <span class="lever"></span>
            On
        </label>
    </div>
</template>

<script>
export default {
    name: 'OptionsSwitch',
    props: ['isSet'],
    data() {
        return {
            value: null
        }
    },
    mounted() {
        this.$refs.checkbox.checked = this.isSet
    },
    methods: {
        changed() {
            console.log(this.$refs.checkbox.checked)
            let val = this.$refs.checkbox.checked
            this.$emit('valueChanged', val)
        }
    }
}
</script>