<template>
    <b-modal :id="id" no-close-on-backdrop class="change-password-modal" @hide="hideChangePasswordModal">
        <template v-slot:modal-header="{ cancel }">
            <div class="modal-head-layout">
                <span class="modal-header-text">Change Password</span>
            </div>
            <div class="pointer" @click="cancel">
                <font-awesome-icon icon="times" class="white" />
            </div>
        </template>
        <section class="modal-section">
            <BaseInputFieldWithBorderAndFloatingLabel
                :className="[hasError(changePasswordErrors.oldPassword) ? 'error' : '', '']"
                type="password"
                v-model="changePasswordForm.oldPassword"
                @input="validateOldPassword"
                floatingLabelText="Old Password"
                :errors="changePasswordErrors.oldPassword"
            />
            <BaseInputFieldWithBorderAndFloatingLabel
                type="password"
                v-model="changePasswordForm.newPassword"
                @input="validateNewPassword"
                floatingLabelText="New Password"
                :errors="changePasswordErrors.newPassword"
                :className="[hasError(changePasswordErrors.newPassword) ? 'error' : '', '']"
            />
            <BaseInputFieldWithBorderAndFloatingLabel
                type="password"
                :className="[hasError(changePasswordErrors.confirmPassword) ? 'error' : '', '']"
                v-model="changePasswordForm.confirmPassword"
                @input="validateConfirmPassword"
                :errors="changePasswordErrors.confirmPassword"
                floatingLabelText="Confirm Password"
            />
        </section>
        <template v-slot:modal-footer>
            <div class="modal-bnt-layout">
                <BasePrimaryButton
                    className="button"
                    :disabled="conditionsForChangePasswordButtonToBeDisabled"
                    :status="authRequestStatus.changePassword"
                    @button-clicked="handlePasswordChangeSubmission"
                >
                    Save
                </BasePrimaryButton>
            </div>
        </template>

        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import { AuthRequestStatus, Status, Toaster } from '@/types';

import AuthModule from '@/store/modules/auth.ts';
import SettingsMixin from '@/pages/Settings/mixins';
import UtilityMixins from '@/mixins/Utility';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class ChangePasswordModal extends Mixins(SettingsMixin, UtilityMixins) {
    @Prop({ required: true }) readonly id!: string;
    @Prop({ default: false }) readonly passwordIsValidated!: boolean;

    @auth.State
    public error!: string;

    @auth.State
    public authRequestStatus!: AuthRequestStatus;

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        position: 'b-toaster-top-center',
        id: 'change-password-toaster',
    };

    private hideChangePasswordModal() {
        this.$emit('hide-change-password-modal');
    }

    private showPasswordModal() {
        this.$bvModal.show(this.id);
    }

    private hidePasswordModal() {
        this.$bvModal.hide(this.id);
    }

    private async changePassword() {
        const { oldPassword, newPassword } = this.changePasswordForm;
        await authModule.changePassword({ oldPassword, newPassword });
        if (this.authRequestStatus.changePassword === Status.SUCCESS) {
            this.handleSuccessEvent();
            return;
        }
        if (this.authRequestStatus.changePassword === Status.ERROR) {
            this.showNotication(false);
        }
    }

    private showNotication(isSuccess = true) {
        if (!isSuccess) {
            this.toaster.type = 'danger';
            this.toaster.title = 'Error!';
            this.toaster.message = this.error;
            this.showToaster(this.toaster);
            return;
        }

        this.toaster.type = 'success';
        this.toaster.title = 'Success!';
        this.toaster.message = 'You have successfully chnaged your password';
        this.showToaster(this.toaster);
    }

    private handleSuccessEvent() {
        this.showNotication();
        setTimeout(() => {
            this.hidePasswordModal();
        }, 1200);
    }

    private resetPasswordValidation() {
        this.$emit('reset-password-validation');
    }

    private assignModule() {
        authModule = getModule(AuthModule, this.$store);
    }

    @Watch('passwordIsValidated')
    handlePasswordChange(passwordIsValidated: boolean) {
        if (!passwordIsValidated) return;
        this.changePassword();
        this.resetPasswordValidation();
    }

    mounted() {
        this.assignModule();
        this.showPasswordModal();
    }
}
</script>

<style lang="scss"></style>
