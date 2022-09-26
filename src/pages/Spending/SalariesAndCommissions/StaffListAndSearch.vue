<template>
    <b-container fluid class="p-0 donor-list__wrapper">
        <!--Donor Search-->
        <b-row class="donor-list__search-list mx-0" tabindex="-1" ref="staffList">
            <div class="donor-list__top-section--left">
                <BaseInputField
                    placeholder="Select Staff"
                    inputContainerClass="donor-list__search"
                    className="donor-list__search--input"
                    v-model="searchString"
                    @focus="showStaffs"
                    @blur="hideStaff"
                />
            </div>
            <!--  -->
            <div class="donor-list__top-section--right">
                <span class="donor-list__search--icon-container">
                    <!-- <font-awesome-icon icon="search" class="donor-list__search--icon" /> -->
                </span>
                <span class="donor-list__add-donor-btn" @click.prevent="addNewStaff">New Staff</span>
            </div>
        </b-row>

        <!--Staff List-->

        <b-row class="donor-list__donors--container mx-0" v-if="showStaffList" @mousedown="preventBlurFromHappening">
            <div class="select-staff__loader" v-if="paymentAndCommissionRequestIsLoading">
                <Loader size="4" />
            </div>
            <b-col v-else col="12" :class="avatarContainerClass">
                <AvatarAndResource
                    v-for="staff in staffToBeDisplayed"
                    :key="staff.staffPaymentKey"
                    :resourceName="staff.staffName"
                    :showChevronIcon="false"
                    :itemKey="staff.staffPaymentKey"
                    :expandedItemKey="expandedStaffKey"
                    @resource-selected="handleStaffSelection(staff)"
                    repositionName="avatar-and-resource__details-reposition"
                >
                </AvatarAndResource>
            </b-col>

            <div v-if="requestIsLoading" cols="12" class="donor-list__donors--loader">
                <Loader size="3" />
            </div>

            <div v-show="contentIsEmpty" cols="12" class="donor-list__donors--empty">
                <span v-html="noContentMessage"></span>
            </div>
        </b-row>

        <!--Add New Donor-->
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import { Status } from '@/types';

import { Staff } from '@/pages/Spending/SalariesAndCommissions/types';

import AddDonorModal from '@/pages/Donations/Donors/AddOrEditDonorModal.vue';

import UtilityMixins from '@/mixins/Utility';

@Component({
    components: {
        AddDonorModal,
    },
})
export default class StaffListAndSearch extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly staffs!: Staff[];
    @Prop({ default: Status.NORMAL }) readonly requestStatus!: Status;
    @Prop({ default: false }) readonly resetFormInput!: boolean;
    @Prop({ default: false }) readonly paymentAndCommissionRequestIsLoading!: boolean;

    private searchString = '';
    private expandedStaffKey = '';

    private showStaffList = false;

    public $refs!: {
        donorList: HTMLFormElement;
    };
    private showAddStaff = false;

    get requestIsLoading() {
        return this.requestStatus === Status.LOADING;
    }

    get searchStringIsEmpty(): boolean {
        return this.searchString === '';
    }

    get contentIsEmpty() {
        return !this.requestIsLoading && this.noContentMessage != '';
    }

    get searchMatchFound(): boolean {
        if (this.searchString.length == 0) return true;
        if (this.searchString.length > 0 && this.staffs.length < 1) return true;
        return this.staffToBeDisplayed.length > 0;
    }

    get staffAreAvailable(): boolean {
        return this.staffs.length > 0 ? true : false;
    }

    get staffToBeDisplayed(): Staff[] {
        if (this.searchStringIsEmpty) return this.staffs;

        return this.staffs.filter(staff => staff.staffName.toLowerCase().match(this.searchString.toLowerCase()));
    }

    get avatarContainerClass(): string {
        // return !this.userIsOnTablet ? 'avatar-and-resource__container' : '';
        return 'avatar-and-resource__container';
    }

    get noContentMessage() {
        if (!this.searchMatchFound) {
            return `<p>No match found</p>`;
        }
        if (!this.staffAreAvailable) {
            return `<p>Looks like you haven't added any staff yet.</p>
                        <p>Click the 'New Staff' link above to add a staff</p>`;
        }
        return '';
    }

    @Watch('resetFormInput')
    resetFormInputValue(resetFormInput: boolean) {
        if (resetFormInput) {
            this.searchString = '';
        }
    }

    @Watch('preselectedDonor.fullName')
    setFormValue(donorName: string) {
        this.searchString = donorName;
    }

    private showStaffModal() {
        this.$bvModal.show('add-or-edit-donor-modal');
    }

    private hideDonorModal() {
        this.$bvModal.hide('add-or-edit-donor-modal');
    }

    private handleNewStaffCreation(staff: Staff) {
        this.handleStaffSelection(staff);
        this.dismissModal();
    }

    private dismissModal() {
        setTimeout(() => {
            this.hideDonorModal();
        }, 1000);
    }

    private addNewStaff() {
        this.$emit('add-new-staff', true);
    }

    private showStaffs() {
        this.showStaffList = true;
        this.showAddStaff = true;
    }

    private hideStaff() {
        this.showStaffList = false;
        this.showAddStaff = false;
    }

    private handleStaffSelection(staff: Staff) {
        this.showStaffList = false;
        this.showAddStaff = false;
        this.searchString = staff.staffName;

        this.$emit('staff-selected', staff);
    }

    private toggleStaff(key: string) {
        if (this.expandedStaffKey == key) {
            this.expandedStaffKey = '';
            return;
        }
        this.expandedStaffKey = key;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/new-donation/donor-list-and-search.scss';
</style>
