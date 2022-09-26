<template>
    <div class="change-password-success-m">
        <div class="change-password-success-m__container">
            <img src="@/assets/img/Group.png" alt="hand clap icon" />
            <h3 class="change-password-success-m__heading--primary">Congratulations!</h3>
            <p class="change-password-success-m__heading--secondary">Your password has been changed successfully</p>

            <BaseButton
                :overRideButtonClass="true"
                className="change-password-success-m__button"
                @button-clicked="handleContinuationFromPasswordChange"
            >
                Continue
            </BaseButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ChangePasswordSuccessMobile extends Vue {
    public handleContinuationFromPasswordChange() {
        this.$emit('continue-to-user-profile-home-page');
    }
}
</script>

<style lang="scss">
.change-password-success-m {
    text-align: center;
    max-width: 263px;
    margin: 35px auto 0 auto;
    &__heading {
        &--primary {
            font-weight: 500;
            font-size: 20px;
        }
        &--secondary {
            font-weight: normal;
            font-size: 14px;
        }
    }
    &__button {
        @include user-profile-settings-button;
        margin-top: 35px;
    }
}
</style>
