<template>
    <AuthFooterLayout>
        <transition name="fade" mode="out-in">
            <component
                :is="componentsList[activeComponentIndex]"
                @password-reset-email-sent-successfully="handlePasswordResetEmailSentSuccessfully"
            />
        </transition>
    </AuthFooterLayout>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator';

import EmailForm from '@/pages/ForgotPassword/EmailForm.vue';
import ResetLinkPage from '@/pages/ForgotPassword/ResetLinkPage.vue';

import AuthFooterLayout from '@/pages/auth/layout/Footer.vue';

import DynamicComponentMixin from '@/mixins/dynamicComponents';

@Component({
    components: {
        EmailForm,
        ResetLinkPage,
        AuthFooterLayout,
    },
})
export default class ForgotPasswordIndex extends Mixins(DynamicComponentMixin) {
    private componentsList = [EmailForm, ResetLinkPage];

    private goToResetLinkPage() {
        this.setActiveComponentIndex(1);
    }

    private handlePasswordResetEmailSentSuccessfully() {
        this.goToResetLinkPage();
    }
}
</script>

<style lang="scss"></style>
