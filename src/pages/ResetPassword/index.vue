<template>
    <AuthFooterLayout>
        <transition name="fade" mode="out-in">
            <component
                :is="componentsList[activeComponentIndex]"
                @password-has-been-reset-successfully="handleSuccessfulPasswordReset"
            />
        </transition>
    </AuthFooterLayout>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator';

import PasswordForm from '@/pages/ResetPassword/PasswordForm.vue';
import PasswordResetSuccessPage from '@/pages/ResetPassword/PasswordResetSuccessPage.vue';

import AuthFooterLayout from '@/pages/auth/layout/Footer.vue';

import DynamicComponentMixin from '@/mixins/dynamicComponents';

@Component({
    components: {
        PasswordForm,
        PasswordResetSuccessPage,
        AuthFooterLayout,
    },
})
export default class ForgotPasswordIndex extends Mixins(DynamicComponentMixin) {
    private componentsList = [PasswordForm, PasswordResetSuccessPage];

    private goToPasswordResetSuccessPage() {
        this.setActiveComponentIndex(1);
    }

    private handleSuccessfulPasswordReset() {
        this.goToPasswordResetSuccessPage();
    }
}
</script>

<style lang="scss"></style>
