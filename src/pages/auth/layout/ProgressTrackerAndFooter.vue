<template>
    <FooterLayout>
        <ProgressTracker v-if="!$root.isMobileScreenSize" />
        <slot></slot>
    </FooterLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import FooterLayout from '@/pages/auth/layout/Footer.vue';
import ProgressTracker from '@/components/ui/ProgressTracker.vue';

@Component({
    components: {
        ProgressTracker,
        FooterLayout,
    },
})
export default class ProgressTrackerAndFooterLayout extends Vue {}
</script>
