<template>
    <b-container class="add-vendor-form" fluid>
        <!--Vendor Name-->
        <b-row class="add-vendor-form__input--row">
            <b-col class="p-0">
                <BaseInputFieldWithBorderAndFloatingLabel
                    :required="true"
                    floatingLabelText="Name"
                    inputContainerClass="add-vendor-form"
                    className="add-vendor-form__input--field"
                    v-model="newVendor.name"
                    :errors="addVendorError.name"
                    @input="validateVendorName(newVendor.name)"
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

        <!--Phone Number-->
        <b-row class="add-vendor-form__input--row">
            <b-col class="p-0">
                <BaseInputFieldWithBorderAndFloatingLabel
                    :required="true"
                    floatingLabelText="Phone Number"
                    inputContainerClass="add-vendor-form"
                    className="add-vendor-form__input--field"
                    v-model="newVendor.phoneNumber"
                    :errors="addVendorError.phoneNumber"
                    @input="validateVendorPhoneNumber(newVendor.phoneNumber)"
                />
            </b-col>
        </b-row>

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

        <transition name="slide-up-fade" mode="out-in">
            <div v-if="showMoreDetails">
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
                :status="vendorRequest"
                :disabled="buttonShouldBeDisabled"
                @button-clicked="handleNewVendorForm"
            />
        </b-row>

        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </b-container>
</template>

<script lang="ts">
/*eslint-disable @typescript-eslint/no-explicit-any*/
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import VendorModule from '@/store/modules/vendor';
import { RadioButtonOption, Status, Vendor, defaultVendor } from '@/types';

import { AddVendorRequest, VendorRequestStatus, VendorType } from '@/pages/Spending/Expense/types';

const vendors = namespace('vendor');
let vendorModule: VendorModule;

import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';

@Component
export default class AddOrEditVendorForm extends Mixins(ExpenseMixin) {
    @Prop({ default: '' }) readonly searchedVendor!: string;
    @Prop({ default: false }) readonly vendorIsToBeEdited!: boolean;
    @Prop({ default: () => defaultVendor }) readonly selectedVendorForEditing!: Vendor;

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

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'vendor-request-notification',
        position: 'b-toaster-top-center',
    };

    @vendors.State
    private vendorRequestStatus!: VendorRequestStatus;

    @vendors.State
    private errorCode!: number;

    @vendors.Action
    private createdVendor!: Vendor;

    get buttonShouldBeDisabled() {
        return !this.addVendorFormIsReadyForSubmission || this.vendorRequest === 'LOADING';
    }

    get vendorRequest() {
        return this.vendorIsToBeEdited ? this.vendorRequestStatus.updateVendor : this.vendorRequestStatus.addVendor;
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

    private updateVendorForm() {
        if (this.vendorIsToBeEdited) {
            this.setVendorToBeEditedDetails();
        }
    }

    private setVendorToBeEditedDetails() {
        const { name, phoneNumber, email, note, vendorType, vendorKey, address } = this.selectedVendorForEditing;
        this.$set(this.newVendor, 'name', name);
        this.$set(this.newVendor, 'phoneNumber', phoneNumber);
        this.$set(this.newVendor, 'email', email);
        this.$set(this.newVendor, 'note', note);
        this.$set(this.newVendor, 'address', address);
        this.$set(this.newVendor, 'vendorTypeName', vendorType);
        this.$set(this.newVendor, 'vendorKey', vendorKey);
    }

    private handleNewVendorForm() {
        this.validateAddVendorForm(this.newVendor);
        if (!this.addVendorFormIsReadyForSubmission) return;
        if (this.vendorIsToBeEdited) {
            this.editVendor();
            return;
        }
        this.createNewVendor();
    }

    private async createNewVendor() {
        await vendorModule.createVendor(this.newVendor);

        if (this.vendorRequest === Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Vendor added successfully',
            });
            this.$emit('new-vendor-created', this.createdVendor);
        }
        if (this.vendorRequest === Status.ERROR) {
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

    private async editVendor() {
        await vendorModule.updateVendorDetails(this.newVendor);

        if (this.vendorRequest === Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Vendor updated successfully',
            });

            const emitVendor = {
                ...this.newVendor,
                vendorType: this.newVendor.vendorTypeName,
            };

            this.$emit('existing-vendor-updated', emitVendor);

            //initiate a refresh for the vendor list
            vendorModule.getVendors();
        }
        if (this.vendorRequest === Status.ERROR) {
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
                message: 'There was an error updating this vendor. please retry later',
            });
        }
    }

    //Close add vendor modal on backdrop only when the form content is empty
    @Watch('newVendor', { immediate: true, deep: true })
    checkVendorDetails() {
        const vendorDetails = Object.values(this.newVendor);
        let allDetailsAreEmpty = true;
        vendorDetails.forEach(detail => {
            if (detail !== '') {
                allDetailsAreEmpty = false;
            }
        });
        if (allDetailsAreEmpty) {
            this.$emit('close-vendor-modal-on-backdrop', true);
            return;
        }
        this.$emit('close-vendor-modal-on-backdrop', false);
    }

    mounted() {
        vendorModule = getModule(VendorModule, this.$store);
        this.updateVendorName();
        this.updateVendorForm();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/new-vendor-form';
</style>
