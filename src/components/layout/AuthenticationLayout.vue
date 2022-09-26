<template>
    <SplitScreenLayout>
        <template v-slot:white-screen>
            <div class="company__text-box align-items">
                <h1 class="heading-primary landing-page-width-primary u-margin-bottom-big">
                    Empower your Business Profitably and Seamlessly
                </h1>
                <h2 class="heading-secondary landing-page-width-secondary">
                    Every little detail matters. <br />
                    Update your records and gain new insights each time.
                </h2>
            </div>
        </template>
        <template v-slot:background-screen>
            <div class="col-md-6 form-right">
                <form class="form auth-form-container">
                    <slot></slot>
                </form>
            </div>
        </template>
    </SplitScreenLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import SplitScreenLayout from '@/components/layout/SplitScreenLayout.vue';

@Component({
    components: {
        SplitScreenLayout,
    },
})
export default class AuthenticationLayout extends Vue {}
</script>

<style lang="scss">
@import 'src/styles/pages/authentication.scss';
</style>
