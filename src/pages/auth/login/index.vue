<template>
    <AuthFooterLayout>
        <LoginPage />
    </AuthFooterLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import LoginPage from '@/pages/auth/login/login.vue';
import AuthFooterLayout from '@/pages/auth/layout/Footer.vue';

@Component({
    components: {
        LoginPage,
        AuthFooterLayout,
    },
})
export default class LoginIndex extends Vue {}
</script>

<style lang="scss"></style>
