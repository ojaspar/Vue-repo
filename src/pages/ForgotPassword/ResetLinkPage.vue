<template>
    <div class="reset-link">
        <MzuriLogo className="reset-link__logo-container" />
        <div class="reset-link__medium-plus-container">
            <div class="reset-link__medium-plus-inner-container">
                <div class="reset-link__center-items">
                    <img src="@/assets/img/mail-icon.svg" alt="mail icon" class="reset-link__mail-icon" />
                    <p class="reset-link__action-text">
                        A reset link has been sent to your email, kindly check your email.
                    </p>

                    <p class="reset-link__sign-in-text">
                        <router-link class="reset-link__click-here-text" to="/login">Click here </router-link> to sign
                        in.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class PasswordResetLinkPage extends Vue {}
</script>

<style lang="scss">
@import 'src/styles/pages/forgot-password/reset-link-page.scss';
</style>
