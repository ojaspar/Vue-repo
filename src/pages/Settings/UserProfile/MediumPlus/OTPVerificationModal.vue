<template>
    <BaseModal :modalId="id" @hide-modal="hideOTPVerificationModal" modalTitle="OTP Verification">
        <section class="otp-verification-content">
            <div class="otp-verification-content__container">
                <p class="otp-verification-content__heading">
                    An OTP code was sent to your phone and email, kindly input the code below.
                </p>
                <b-row class="otp-verification-content__otp-input-container">
                    <b-col>
                        <BaseInputField
                            type="text"
                            className="otp-verification-content__otp-box"
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
                            className="otp-verification-content__otp-box"
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
                            className="otp-verification-content__otp-box"
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
                            className="otp-verification-content__otp-box"
                            v-model="form.inputFour"
                            @handleFocus="handleFocus"
                            :autoFocus="focusIndex === 4"
                            @delete-or-backspace-key-pressed="handleOTPDeletion"
                            @input="handleOTPInput"
                        />
                    </b-col>
                </b-row>
                <div class="otp-verification-content__button-container">
                    <BaseButton
                        className="otp-verification-content__button"
                        overRideButtonClass="true"
                        @button-clicked="handleButtonClick"
                        :disabled="conditionsForOTPButtonToBeDisabled"
                    >
                        Submit
                    </BaseButton>
                </div>
            </div>
        </section>
        <template v-slot:modal-footer>
            <div></div>
        </template>
    </BaseModal>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import OTPMixin from '@/mixins/Otp';
import InputFieldMixins from '@/mixins/InputFieldMixins';

@Component
export default class OTPVerificationModal extends Mixins(OTPMixin, InputFieldMixins) {
    @Prop({ required: true }) readonly id!: string;

    private hideOTPVerificationModal() {
        this.$emit('hide-otp-verification-modal');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/settings/mp-otp-verification-modal.scss';
</style>
