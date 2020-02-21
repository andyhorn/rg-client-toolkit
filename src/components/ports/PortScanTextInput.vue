<template>

        <div>
            <b-form-group
                v-bind:label="values.title"
                v-bind:label-for="values.name"
            >
                <b-form-input
                    v-bind:id="values.name"
                    v-model="values.value"
                    v-bind:required="values.required"
                    v-bind:class="values.success ? 'bg-success text-white' : values.success === false ? 'bg-danger text-white' : ''"
                ></b-form-input>
            </b-form-group>
        </div>

</template>

<script>
export default {
    name: 'PortScanTextInput',
    props: ['values']
}
</script>

<style scoped>
    input[type="text"] {
        padding: 0 5px;
        margin: 0px;
        border-radius: 1px;
    }
    input[type="text"].md-input.success {
        background: green !important;
        color: white !important;
    }

    input.md-input.failure {
        background: red !important;
    }
</style>