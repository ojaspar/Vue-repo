<template>
    <b-modal :id="id" no-close-on-backdrop class="change-password-success-modal" @hide="hideChangePasswordSuccessModal">
        <template v-slot:modal-header="{ cancel }">
            <div class="modal-head-layout">
                <h3 class="white">Success</h3>
            </div>
            <div class="pointer" @click="cancel">
                <font-awesome-icon icon="times" class="white pointer" @click="cancel" />
            </div>
        </template>
        <section class="change-password-success-mp">
            <div class="change-password-success-mp__heading-container">
                <img src="@/assets/img/Group.png" class="change-password-success-mp__clap-icon" alt="hand clap icon" />
                <h3 class="change-password-success-mp__heading--primary">Congratulations!</h3>
                <p class="change-password-success-mp__heading--secondary">
                    Your password has been changed successfully
                </p>
            </div>
        </section>
        <template v-slot:modal-footer>
            <div class="change-password-success-mp__button-container">
                <BaseButton
                    className="button"
                    :overRideButtonClass="true"
                    @button-clicked="hideChangePasswordSuccessModal"
                >
                    Continue
                </BaseButton>
            </div>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ChangePasswordSuccessModal extends Vue {
    @Prop({ required: true }) readonly id!: string;

    private hideChangePasswordSuccessModal() {
        this.$emit('hide-change-password-success-modal');
    }

    mounted() {
        this.$bvModal.show(this.id);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/settings/mp-change-password-success-modal.scss';
</style>
