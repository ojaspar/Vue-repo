<template>
    <div class="main-container">
        <div :class="contentDivClass">
            <div class="verification">
                <div v-if="accountVerificationRequest === 'LOADING'">
                    <Loader class="icon__loading" />
                    <p class="status-message--loading">{{ statusMessage }}</p>
                </div>
                <div v-else-if="accountVerified">
                    <img class="icon__success" alt="" src="@/assets/img/check-light-green.svg" />
                    <p class="status-message--success">{{ statusMessage }}</p>
                    <BaseButton
                        className="content__btn uppercase"
                        buttonText="Login"
                        @button-clicked="redirectToLoginPage"
                    />
                </div>
                <div v-else>
                    <font-awesome-icon icon="exclamation-circle" class="icon__error" />
                    <p class="status-message--error">
                        {{ statusMessage }}
                    </p>
                    <BaseButton
                        className="content__btn uppercase"
                        buttonText="Back To Home"
                        @button-clicked="redirectToLoginPage"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/*eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { Status } from '@/types';

import AuthModule from '@/store/modules/auth.ts';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class AccountVerification extends Vue {
    private accountVerified = false;
    private statusMessage = 'Verifying your e-mail address..';

    @auth.State
    private accountVerificationRequest!: Status;

    @auth.State
    private error!: string;

    get contentDivClass() {
        if (this.accountVerificationRequest === Status.LOADING) {
            return 'content__verification-loading';
        }
        if (this.accountVerificationRequest === Status.ERROR) {
            return 'content__verification-failed';
        }
        return 'content__verification-successful';
    }

    private getVerificationTokenFromURL() {
        const token = encodeURIComponent(this.$route.query.token as string);
        if (token == 'undefined') {
            this.$router.push('/*');
            return;
        }
        this.processAccountVerification(token);
    }

    private async processAccountVerification(verificationToken: string) {
        await authModule.verifyUserAccount(encodeURIComponent(verificationToken));
        if (this.accountVerificationRequest === Status.SUCCESS) {
            this.statusMessage = 'Your e-mail address has been verified successfully';
            this.accountVerified = true;
        }
        if (this.accountVerificationRequest === Status.ERROR) {
            this.statusMessage = 'An error occurred while verifying your e-mail address. Please try again later';
            this.accountVerified = false;
        }
    }

    private redirectToLoginPage() {
        this.$router.push('/login');
    }

    mounted() {
        authModule = getModule(AuthModule, this.$store);
        this.getVerificationTokenFromURL();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/account-verification.scss';
</style>
