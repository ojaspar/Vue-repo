<template>
    <div class="full-page-loader">
        <div class="full-page-loader__background"></div>
        <Loader :size="size" class="full-page-loader__spinner" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Loader from '@/components/ui/Loader.vue';

@Component({
    components: {
        Loader,
    },
})
export default class FullPageLoader extends Vue {
    @Prop({ default: '5' }) size!: string;
}
</script>

<style lang="scss">
@import 'src/styles/components/full-page-loader';
</style>
