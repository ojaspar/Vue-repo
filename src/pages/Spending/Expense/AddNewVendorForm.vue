<template>
    <b-container class="add-vendor-form" fluid>
        <!--Vendor Name-->
        <b-row class="add-vendor-form__input--row">
            <b-col class="p-0">
                <BaseInputFieldWithBorderAndFloatingLabel
                    :required="true"
                    placeholder="Name"
                    inputContainerClass="add-vendor-form"
                    className="add-vendor-form__input--field"
                    v-model="newVendor.name"
                    :errors="addVendorError.name"
                    @input="validateVendorName(newVendor.name)"
                />
            </b-col>
        </b-row>

        <!--Phone Number-->
        <b-row class="add-vendor-form__input--row">
            <b-col class="p-0">
                <BaseInputFieldWithBorderAndFloatingLabel
                    :required="true"
                    placeholder="Phone Number"
                    inputContainerClass="add-vendor-form"
                    className="add-vendor-form__input--field"
                    v-model="newVendor.phoneNumber"
                    :errors="addVendorError.phoneNumber"
                    @input="validateVendorPhoneNumber(newVendor.phoneNumber)"
                />
            </b-col>
        </b-row>

        <!--Vendor Type-->
        <BaseRadioGroupWithBorderAndFloatingLabel
            floatingLabelText="Vendor Type"
            :radioButtonOptions="radioButtonOptions"
            v-model="newVendor.vendorTypeName"
            @change="setVendorType"
            :checkedValue="newVendor.vendorTypeName"
            :errors="addVendorError.vendorTypeName"
        />

        <transition name="slide-up-fade">
            <div v-if="showMoreDetails">
                <!--E-mail Address-->
                <b-row class="add-vendor-form__input--row">
                    <b-col class="p-0">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            :required="true"
                            placeholder="E-mail"
                            inputContainerClass="add-vendor-form"
                            className="add-vendor-form__input--field"
                            v-model="newVendor.email"
                            :errors="addVendorError.email"
                            @input="validateVendorEmail(newVendor.email)"
                        />
                    </b-col>
                </b-row>

                <!--Notes-->
                <b-row class="add-vendor-form__input--row">
                    <b-col class="p-0">
                        <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Notes" v-model="newVendor.note" />
                    </b-col>
                </b-row>

                <!--Address-->
                <b-row class="add-vendor-form__input--row">
                    <b-col class="p-0">
                        <BaseTextAreaWithBorderAndFloatingLabel
                            floatingLabelText="Address"
                            v-model="newVendor.address"
                        />
                    </b-col>
                </b-row>
            </div>
        </transition>

        <p class="add-vendor-form__more-details">
            <span class="add-vendor-form__more-details--link" @click="toggleFormDetails">
                {{ moreDetailsLinkText }}
            </span>
        </p>

        <!--Save Button-->
        <b-row class="add-vendor-form__footer">
            <BaseButton
                buttonText="Save"
                className="add-vendor-form__save-btn"
                overRideButtonClass="false"
                :status="addVendorRequest"
                :disabled="buttonShouldBeDisabled"
                @button-clicked="handleNewVendorForm"
            />
        </b-row>
    </b-container>
</template>

<script lang="ts">
/*eslint-disable @typescript-eslint/no-explicit-any*/
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import VendorModule from '@/store/modules/vendor';
import { RadioButtonOption, Status, Vendor } from '@/types';

import { AddVendorRequest, VendorRequestStatus, VendorType } from '@/pages/Spending/Expense/types';

const vendors = namespace('vendor');
let vendorModule: VendorModule;

import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';

@Component
export default class NewVendorForm extends Mixins(ExpenseMixin) {
    @Prop({ default: '' }) readonly searchedVendor!: string;
    private newVendor: AddVendorRequest = {
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        note: '',
        vendorTypeName: VendorType.BUSINESS,
    };

    private radioButtonOptions: RadioButtonOption = {
        name: 'vendorType',
        values: [VendorType.BUSINESS, VendorType.INDIVIDUAL],
    };

    private showMoreDetails = false;

    @vendors.State
    private vendorRequestStatus!: VendorRequestStatus;

    @vendors.State
    private createdVendor!: Vendor;

    @vendors.State
    private errorCode!: number;

    @vendors.Action
    private createVendor!: () => Array<Vendor>;

    get buttonShouldBeDisabled() {
        return !this.addVendorFormIsReadyForSubmission || this.addVendorRequest === 'LOADING';
    }

    get addVendorRequest() {
        return this.vendorRequestStatus.addVendor;
    }

    get moreDetailsLinkText() {
        return this.showMoreDetails ? 'Less Details' : 'More Details';
    }

    private toggleFormDetails() {
        this.showMoreDetails = !this.showMoreDetails;
    }

    private setVendorType(vendorType: string) {
        this.newVendor.vendorTypeName = vendorType;
        this.validateVendorType(this.newVendor.vendorTypeName);
    }

    private updateVendorName() {
        if (this.searchedVendor !== '') {
            this.newVendor.name = this.searchedVendor;
        }
    }

    private handleNewVendorForm() {
        this.validateAddVendorForm(this.newVendor);
        if (!this.addVendorFormIsReadyForSubmission) return;
        this.createNewVendor();
    }

    private async createNewVendor() {
        await vendorModule.createVendor(this.newVendor);

        if (this.addVendorRequest === Status.SUCCESS) {
            const { ...createdVendor } = this.createdVendor;
            this.$emit('new-vendor-created', createdVendor);
        }

        if (this.addVendorRequest === Status.ERROR) {
            if (this.errorCode == 680) {
                this.showToaster({
                    ...this.toaster,
                    type: 'danger',
                    title: 'Error!',
                    message: 'This vendor already exists',
                });
                return;
            }

            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: 'There was an error adding this vendor. please retry later',
            });
        }
    }

    mounted() {
        vendorModule = getModule(VendorModule, this.$store);
        this.updateVendorName();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/new-vendor-form';
</style>
