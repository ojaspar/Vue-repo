<template>
    <div>
        <slot></slot>
        <footer class="auth-layout__footer" v-if="!$root.isMobileScreenSize">
            &copy; {{ new Date().getFullYear() }} Mzuri Solutions. All Rights Reserved
        </footer>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AuthFooterLayout extends Vue {}
</script>

<style lang="scss">
@import 'src/styles/pages/auth/layout.scss';
</style>
