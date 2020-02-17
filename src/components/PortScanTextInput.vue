<template>

    <div class="row">
        <div class="input-field col s12">
            <input type="text"
            v-model="values.value"
            v-bind:required="values.required"
            class="validate"
            v-bind:id="values.name"
            v-bind:name="values.name"
            v-bind:class="values.success ? 'green white-text' : values.success === false ? 'red white-text' : ''"
            />
            <label class="active" v-bind:for="values.name">{{ values.title }}</label>
        </div>
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
        border-radius: 1px;
    }
</style>