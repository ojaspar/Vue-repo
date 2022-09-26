<template>
    <div v-if="message" class="Error text-center w-100">
        {{ message }}
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        message: {
            type: String,
            default: '',
        },
    },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/components/error';
</style>
