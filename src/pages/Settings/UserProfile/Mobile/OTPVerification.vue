<template>
    <div>
        <div>
            <p class="otp-text">An OTP code was sent to your phone and email, kindly input the code below</p>
            <div class="spacer">
                <b-row>
                    <b-col>
                        <BaseInputField
                            type="text"
                            className="otp-box"
                            v-model="form.inputOne"
                            @focus="handleFocus"
                            :autoFocus="focusIndex === 1"
                            @delete-or-backspace-key-pressed="handleOTPDeletion"
                            @input="handleOTPInput"
                        />
                    </b-col>
                    <b-col>
                        <BaseInputField
                            type="text"
                            className="otp-box"
                            v-model="form.inputTwo"
                            @focus="handleFocus"
                            :autoFocus="focusIndex === 2"
                            @delete-or-backspace-key-pressed="handleOTPDeletion"
                            @input="handleOTPInput"
                        />
                    </b-col>
                    <b-col>
                        <BaseInputField
                            type="text"
                            className="otp-box"
                            v-model="form.inputThree"
                            @focus="handleFocus"
                            :autoFocus="focusIndex === 3"
                            @delete-or-backspace-key-pressed="handleOTPDeletion"
                            @input="handleOTPInput"
                        />
                    </b-col>
                    <b-col>
                        <BaseInputField
                            type="text"
                            className="otp-box"
                            v-model="form.inputFour"
                            @handleFocus="handleFocus"
                            :autoFocus="focusIndex === 4"
                            @delete-or-backspace-key-pressed="handleOTPDeletion"
                            @input="handleOTPInput"
                        />
                    </b-col>
                </b-row>
            </div>
            <div class="otp-verification__button-container">
                <BaseButton
                    :overRideButtonClass="true"
                    className="otp-verification-button"
                    @button-clicked="handleButtonClick"
                    :disabled="conditionsForOTPButtonToBeDisabled"
                >
                    Submit
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import InputFieldMixins from '@/mixins/InputFieldMixins';
import OTPMixin from '@/mixins/Otp';

@Component
export default class OTPVerificationMobile extends Mixins(InputFieldMixins, OTPMixin) {}
</script>

<style lang="scss">
.otp-verification {
    &__button-container {
        text-align: center;
    }
}
.otp-text {
    font-size: 14px;
}

.otp-box {
    width: 50px;
    height: 50px;
    background: #f9f9f9;
    border-radius: 3px;
    text-align: center;
}
.spacer {
    margin: 50px 0 0;
}

.otp-verification-button {
    @include user-profile-settings-button;
    margin-top: 50px;
}

.modal-bnt-layout {
    width: 100%;
    text-align: center;
}
</style>
