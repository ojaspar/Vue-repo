<template>
    <b-container fluid class="add-donation">
        <SuccessPage v-if="donationMadeSuccessfully" successText="Your Donation was recorded successfully">
            <BaseButton
                buttonText="Donations History"
                :overRideButtonClass="true"
                @button-clicked="goToDonationsDashboard"
                className="success-page__btn success-page__btn--receipt success-page__btn--white"
            />
            <BasePrimaryButton
                buttonText="New Donation"
                @button-clicked="startFreshDonation"
                className="success-page__btn success-page__btn--blue"
            />
        </SuccessPage>

        <b-row class="add-donation-content p-0" v-else>
            <b-col sm="12" md="8" lg="4" class="p-0 add-donation-content__left" v-if="splitPageIntoTwoSections">
                <TabletPlusNavigationHeader
                    v-if="!$root.isMobileScreenSize"
                    :activeComponentIndex="activeComponentIndex"
                    :pageTitle="pageTitle"
                    :showCart="shouldShowCart"
                    :showBackButton="showBackButton"
                    @back-button-clicked="goBack"
                />

                <MobileHeader
                    :class="proceedWithoutDonor ? 'no-donor-class' : 'donor-class'"
                    :customerName="selectedDonorName"
                    v-if="showDonorCard"
                />

                <div class="donor-card-spacer" v-if="showDonorCard"></div>

                <div class="add-donation-content__body" :class="cardClass">
                    <transition name="slide-up-fade" mode="out-in" appear>
                        <component
                            :is="componentsList[activeComponentIndex]"
                            :isDonorCompulsory="proceedWithoutDonor"
                            :searchedDonorName="searchedDonorName"
                            :selectedDonationScheme="selectedDonationScheme"
                            :searchedDonationSchemeName="searchedDonationSchemeName"
                            :donationSummaries="donationSummaries"
                            :donationBeingEdited="donationBeingEdited"
                            :editMode="editMode"
                            :selectedDonor="selectedDonor"
                            :donationsCreationStatus="donationsCreationStatus"
                            @donor-selected="setDonorForDonation"
                            @proceed-without-donor-text-clicked="proceedWithoutDonorHandler"
                            @new-donor-added="setDonorForDonation"
                            @add-new-donor="showAddNewDonorForm"
                            @donation-scheme-selected="donationSchemeSelected"
                            @add-new-donation-scheme="showAddNewDonationSchemePage"
                            @new-donation-scheme-added="donationSchemeSelected"
                            @add-donation-to-summary="addDonationToSummary"
                            @add-another-donation-button-clicked="restartDonationProcess"
                            @submit-all-donations="submitDonations"
                            @edit-donation-summary-item="editDonationItem"
                            @update-donation-summary-item="updateDonationSummaryItem"
                            @delete-donation-summary-item="deleteDonationSummaryItem"
                        />
                    </transition>
                </div>
            </b-col>

            <b-col
                class="add-donation-content__right"
                :class="[!isFullSummaryPage && 'add-donation-content__right--xl']"
            >
                <DonationSummaryPage
                    :isFullSummaryPage="isFullSummaryPage"
                    :donationSummaries="donationSummaries"
                    :donationsCreationStatus="donationsCreationStatus"
                    @add-another-donation-button-clicked="restartDonationProcess"
                    @show-full-donation-summary-page="showFullDonationSummaryPage"
                    @submit-all-donations="submitDonations"
                    @edit-donation-summary-item="editDonationItem"
                    @delete-donation-summary-item="deleteDonationSummaryItem"
                />
            </b-col>
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
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import SelectDonor from '@/pages/Donations/NewDonation/SelectDonor.vue';
import AddEditDonor from '@/pages/Donations/Donors/AddEditDonor.vue';
import SelectDonationScheme from '@/pages/Donations/DonationSchemes/SelectDonationScheme.vue';
import AddEditDonationScheme from '@/pages/Donations/DonationSchemes/AddEditDonationScheme.vue';
import AddDonation from '@/pages/Donations/NewDonation/AddDonation.vue';
import DonationSummaryPage from '@/pages/Donations/NewDonation/DonationSummaryPage.vue';

import DynamicComponentMixin from '@/mixins/dynamicComponents';
import UtilityMixins from '@/mixins/Utility';
import {
    Donation,
    DonationScheme,
    DonationSummary,
    Donor,
    defaultDonor,
    defaultDonationScheme,
    DonationRequestStatus,
    defaultDonationSummary,
} from '@/pages/Donations/types';
import { LeftIcon, NotificationType, Status, VueExtension } from '@/types';

import GeneralModule from '@/store/modules/general';

const donations = namespace('donation');
const general = namespace('general');

let generalModule: GeneralModule;

@Component({
    components: {
        SelectDonor,
        AddEditDonor,
        SelectDonationScheme,
        AddEditDonationScheme,
        AddDonation,
        DonationSummaryPage,
    },
})
export default class NewDonation extends Mixins(DynamicComponentMixin, UtilityMixins) {
    private componentsList: object[] = [
        SelectDonor,
        AddEditDonor,
        SelectDonationScheme,
        AddEditDonationScheme,
        AddDonation,
        DonationSummaryPage,
    ];
    private donationMadeSuccessfully = false;
    private isFullSummaryPage = false;
    private splitPageIntoTwoSections = true;
    private proceedWithoutDonor = false;
    private editMode = false;
    private selectedDonor: Donor = {
        ...defaultDonor,
    };
    private pageTitle = 'Select Donor';
    private searchedDonorName = '';
    private searchedDonationSchemeName = '';
    private selectedDonationScheme: DonationScheme = { ...defaultDonationScheme };
    private donationSummaries: Array<DonationSummary> = [];
    private indexOfDonationToBeEdited: number | string = '';
    private donationBeingEdited: DonationSummary = { ...defaultDonationSummary };
    private leftIcon = LeftIcon.None;

    public $root!: VueExtension;
    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'record-sale-toaster',
        position: 'b-toaster-top-right',
    };

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    @general.State
    private mobileBackButtonClicked!: boolean;

    @general.State
    private mobileCancelButtonClicked!: boolean;

    @general.State
    private mobileCartButtonClicked!: boolean;

    get selectedDonorName(): string {
        if (this.proceedWithoutDonor) {
            return 'Anonymous Donor';
        }

        if (this.donorNameIsNotEmpty) {
            return this.selectedDonor.fullName;
        }

        return '';
    }

    get cardClass(): string {
        return this.$root.isLargeScreenSize ? 'add-donation-content__body--lg' : '';
    }

    get donorNameIsNotEmpty(): boolean {
        return this.selectedDonor.fullName.length > 0;
    }

    get showDonorCard(): boolean {
        return (this.proceedWithoutDonor || this.donorNameIsNotEmpty) && this.userIsOnMobile;
    }

    get shouldShowCart(): boolean {
        return !this.$root.isLargeScreenSize;
    }

    get userDoesNotHaveAnyDonation(): boolean {
        return this.donationSummaries.length === 0;
    }

    get allDonationsCount(): number {
        return this.donationSummaries.length;
    }

    get showBackButton(): boolean {
        return this.activeComponentIndex === 5 ? false : true;
    }

    get donationsCreationStatus(): string {
        return this.donationRequestStatus.createDonation;
    }

    @Watch('pageTitle')
    pageTitleChanged() {
        this.$parent.$emit('update-page-title', this.pageTitle);
    }

    @Watch('leftIcon')
    leftIconChanged() {
        this.$parent.$emit('set-left-icon', this.leftIcon);
    }

    @Watch('mobileBackButtonClicked')
    watchMobileBackButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.handleGoBack();
        }
        generalModule.setMobileBackButtonState(false);
    }

    @Watch('mobileCancelButtonClicked')
    watchMobileCancelButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.handleGoBack();
        }
        generalModule.setMobileCancelButtonState(false);
    }

    @Watch('mobileCartButtonClicked')
    watchMobileCartButtonState(buttonClicked: boolean) {
        if (buttonClicked && !this.userDoesNotHaveAnyDonation) {
            this.showDonationSummaryPage();
        }
        generalModule.setMobileCartButtonState(false);
    }

    @Watch('activeComponentIndex')
    activeComponentIndexHasChanged(newValue: number) {
        this.$parent.$emit('active-component-index', newValue);
        // this watcher would help for situations whereby the section is handled without the pageTitle being set
        // that is, when this.handlePreviousSection and this.handleNextSection methods are used
        // it helps set the appropriate pageTitle for the appriopriate activeComponentIndex
        switch (newValue) {
            case 0:
                this.pageTitle = 'Select Donor';
                this.setCartVisibility(true);
                this.leftIcon = LeftIcon.Hamburger;
                break;

            case 1:
                this.pageTitle = 'New Donor';
                this.leftIcon = LeftIcon.Back;
                this.setCartVisibility(false);
                break;

            case 2:
                this.pageTitle = 'Select Donation Scheme';
                this.leftIcon = LeftIcon.Cancel;
                this.setCartVisibility(true);
                break;

            case 3:
                this.pageTitle = 'New Donation Scheme';
                this.leftIcon = LeftIcon.Back;
                this.setCartVisibility(false);
                break;

            case 4:
                this.pageTitle = 'Add Donation';
                this.leftIcon = LeftIcon.Back;
                this.setCartVisibility(false);
                break;

            case 5:
                this.pageTitle = 'Donation Summary';
                this.leftIcon = LeftIcon.Hamburger;
                this.setCartVisibility(true);
                break;

            default:
                this.pageTitle = 'Select Donor';
        }
    }

    private proceedWithoutDonorHandler() {
        this.proceedWithoutDonor = true;
        this.$nextTick(() => {
            this.showDonationSchemeSelectionPage();
        });
    }

    private setDonorForDonation(donor: Donor) {
        this.selectedDonor = donor;
        this.$nextTick(() => {
            this.showDonationSchemeSelectionPage();
        });
    }

    private showAddNewDonorForm(searchedDonorName = '') {
        this.searchedDonorName = searchedDonorName;
        this.setActiveComponentIndex(1);
    }

    private showDonationSchemeSelectionPage() {
        this.setActiveComponentIndex(2);
    }

    private showDonorSelectionPage() {
        this.setActiveComponentIndex(0);
    }

    private showAddDonationForm() {
        this.setActiveComponentIndex(4);
    }

    private showDonationSummaryPage() {
        this.setActiveComponentIndex(5);
    }

    private donationSchemeSelected(selectedDonationScheme: DonationScheme) {
        this.selectedDonationScheme = selectedDonationScheme;
        this.showAddDonationForm();
    }

    private showAddNewDonationSchemePage(searchedDononationScheme = '') {
        this.searchedDonationSchemeName = searchedDononationScheme;
        this.setActiveComponentIndex(3);
    }

    private prepareStateForAllScreenSizes() {
        if (this.userIsOnDesktop) {
            this.$nextTick(() => {
                this.isFullSummaryPage = false;
                this.splitPageIntoTwoSections = true;
            });
        }
        this.donationMadeSuccessfully = false;
    }

    private restartDonationProcess() {
        this.prepareStateForAllScreenSizes();
        this.$nextTick(() => {
            this.showDonationSchemeSelectionPage();
        });
    }

    private showFullDonationSummaryPage() {
        if (!this.userIsOnDesktop) return;

        this.$nextTick(() => {
            this.isFullSummaryPage = true;
            this.splitPageIntoTwoSections = false;
        });
    }

    private editDonationItem(indexOfDonationToBeEdited: number) {
        this.editMode = true;
        this.indexOfDonationToBeEdited = Number(indexOfDonationToBeEdited);
        this.donationBeingEdited = this.donationSummaries[Number(indexOfDonationToBeEdited)];
        this.prepareStateForAllScreenSizes();

        this.$nextTick(() => {
            this.showAddDonationForm();
        });
    }

    private updateDonationSummaryItem(updatedDonationForm: Donation) {
        const updatedDonationSummary: DonationSummary = {
            ...updatedDonationForm,
            schemeName: this.selectedDonationScheme.name,
        };

        this.donationSummaries.splice(Number(this.indexOfDonationToBeEdited), 1, updatedDonationSummary);

        this.editMode = false;

        this.handleTransitionAfterChangingDonationSummary();
    }

    private deleteDonationSummaryItem(indexOfDonationToBeDeleted: number) {
        this.donationSummaries.splice(Number(indexOfDonationToBeDeleted), 1);

        this.$nextTick(() => {
            if (this.userDoesNotHaveAnyDonation) {
                this.startFreshDonation();
            }
        });
    }

    private addDonationToSummary(donationForm: Donation) {
        const newDonationSummary: DonationSummary = {
            ...donationForm,
            schemeName: this.selectedDonationScheme.name,
        };
        this.donationSummaries.push(newDonationSummary);

        this.handleTransitionAfterChangingDonationSummary();
    }

    private handleTransitionAfterChangingDonationSummary() {
        if (this.userIsOnDesktop) {
            this.restartDonationProcess();
            return;
        }

        this.showDonationSummaryPage();
    }

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    private clearAllDonationData() {
        this.proceedWithoutDonor = false;
        this.editMode = false;
        this.selectedDonor = { ...defaultDonor };
        this.searchedDonorName = '';
        this.searchedDonationSchemeName = '';
        this.selectedDonationScheme = { ...defaultDonationScheme };
        this.donationSummaries = [];
    }

    private async submitDonations() {
        // transform the properties if changes are necessary
        // submit donations form to the API here

        // if it succeeds, then show the success page here
        // await donationsModule.createDonation(this.donationSummaries);

        if (this.donationRequestStatus.createDonation === Status.SUCCESS) {
            this.showNotification(NotificationType.SUCCESS, 'Donations recorded!');
            this.donationMadeSuccessfully = true;
            this.broadcastCartCount();
            this.setCartVisibility(false);
            this.clearAllDonationData();
            return;
        }

        this.showNotification(NotificationType.ERROR, 'An error occured, please try again !');
    }

    private showNotification(notificationType = NotificationType.SUCCESS, message: string) {
        if (notificationType === NotificationType.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: message || 'Request Successful',
            });
            return;
        }

        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message: message || 'An Error Occured',
        });
    }

    private startFreshDonation() {
        this.proceedWithoutDonor = false;
        this.prepareStateForAllScreenSizes();
        this.selectedDonor = { ...defaultDonor };

        this.$nextTick(() => {
            this.showDonorSelectionPage();
        });
    }

    private setCartVisibility(shouldShow: boolean) {
        if (shouldShow) {
            this.broadcastCartCount();
        }
        this.$parent.$emit('set-show-cart', shouldShow);
    }

    private handleGoBack() {
        switch (this.activeComponentIndex) {
            case 1:
                this.showDonorSelectionPage();
                break;

            case 2:
                this.startFreshDonation();
                this.showDonorSelectionPage();
                break;

            case 3:
            case 4:
                this.showDonationSchemeSelectionPage();
                break;

            default:
                break;
        }
    }

    private broadcastCartCount() {
        this.$parent.$emit('set-cart-count', this.allDonationsCount);
    }

    created() {
        generalModule = getModule(GeneralModule, this.$store);

        this.pageTitleChanged();
        this.setCartVisibility(true);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/add-donation';
</style>
