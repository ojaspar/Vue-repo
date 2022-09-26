<template>
    <div class="password-reset-success-page">
        <MzuriLogo className="password-reset-success-page__logo-container" />
        <div class="password-reset-success-page__medium-plus-container">
            <div class="password-reset-success-page__medium-plus-inner-container">
                <div class="password-reset-success-page__center-items">
                    <img
                        src="@/assets/img/check-green.svg"
                        alt="circular checkmark icon"
                        class="password-reset-success-page__logo"
                    />
                    <h1 class="password-reset-success-page__heading--primary">Successful</h1>
                    <p class="password-reset-success-page__info-text">Your password has been successfully changed</p>
                </div>
                <div class="password-reset-success-page__button-container">
                    <BasePrimaryButton
                        @button-clicked="continueToLoginPage"
                        :overRideButtonClass="true"
                        className="password-reset-success-page__button"
                    >
                        Continue
                    </BasePrimaryButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class PasswordResetSuccessPage extends Vue {
    private continueToLoginPage() {
        this.$router.push({ name: 'Login' });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/forgot-password/password-reset-success-page.scss';
</style>
