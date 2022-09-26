<template>
    <b-container fluid class="donations-page">
        <div class="donations-page__content">
            <!-- Redemption Types Filter -->
            <DashboardStatusFilter :filterList="formsOfDonation" @filter-status-changed="updateItemTypeFilter">
                <template v-slot:buttons>
                    <div class="dashboard-filter__filter-buttons">
                        <DownloadCsv :data="itemsExportData" name="donations.csv">
                            <BaseSecondaryButton buttonText="Export to csv" class="mr-2 w-100" />
                        </DownloadCsv>

                        <BasePrimaryButton
                            buttonText="New Donation"
                            @button-clicked="goToNewDonationPage"
                            class="dashboard-filter__filter-buttons--add-donation"
                        />
                    </div>
                </template>
            </DashboardStatusFilter>

            <!-- Search, Dates, Add New Donations-->
            <DashboardMidSection
                :searchStringValue="itemsSearchString"
                :exportData="itemsExportData"
                searchInputPlaceholder="Search"
                @search-input-changed="updateitemsSearchString"
                @add-new-donation="goToNewDonationPage"
                @from-date-filter-has-changed="setFromDateFilter"
                @to-date-filter-has-changed="setToDateFilter"
            />

            <b-row>
                <b-col class="p-0">
                    <transition name="fade" mode="out-in" appear>
                        <DonatedItemsTable
                            :donations="donationsToBeDisplayed"
                            :searchString="itemsSearchString"
                            :searchMatchFound="searchMatchFound"
                            :status="donatedItemsRequestStatus"
                            @add-item-value="addItemValue"
                        />
                    </transition>
                </b-col>
            </b-row>
        </div>

        <BaseModal :modalId="modalId" :modalTitle="modalTitle" @hide-modal="hideModal">
            <AddItemValue :donatedItem="selectedItem" @add-item-value="hideModal" />
        </BaseModal>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DonatedItemsTable from '@/pages/Donations/DonatedItems/DonatedItemsTable.vue';
import DashboardMidSection from '@/pages/Donations/DashboardMidSection.vue';
import AddItemValue from '@/pages/Donations/DonatedItems/AddItemValue.vue';

import UtilityMixins from '@/mixins/Utility';
import DonationModule from '@/store/modules/donation';

import {
    DonationRequestStatus,
    DonationList,
    Donation,
    defaultDonation,
    FormOfDonation,
    DonationExport,
} from '@/pages/Donations/types';
import { DashboardFilterList } from '@/types';

const donation = namespace('donation');
let donationModule: DonationModule;

@Component({
    components: {
        DonatedItemsTable,
        DashboardMidSection,
        AddItemValue,
    },
})
export default class DonatedItems extends Mixins(UtilityMixins) {
    private pledgeIsBeingRedeemed = false;
    private selectedItem: Donation = { ...defaultDonation };

    private formsOfDonation: DashboardFilterList[] = [
        { key: 'all-items', name: 'Items and Services' },
        { key: 'item', name: FormOfDonation.ITEM },
        { key: 'service', name: FormOfDonation.SERVICE },
    ];

    private fromDate = '';
    private toDate = '';
    private itemsSearchString = '';
    private formOfDonationFilter = 'all-items';

    @donation.State
    private donationRequestStatus!: DonationRequestStatus;

    @donation.State
    private donations!: Array<DonationList>;

    get modalId(): string {
        return 'add-item-value-modal';
    }

    get modalTitle(): string {
        return this.selectedItem.description ?? '';
    }

    get itemsSearchStringIsEmpty() {
        return this.itemsSearchString.length == 0;
    }

    get datesNotSelected() {
        return this.fromDate === '' && this.toDate === '';
    }

    get donatedItemsListToFilter(): DonationList[] {
        if (this.datesNotSelected) {
            return this.donationFormFilteredItems;
        }
        return this.dateFilteredItems;
    }

    get donationsToBeDisplayed(): DonationList[] {
        if (this.itemsSearchStringIsEmpty && this.datesNotSelected) {
            return this.donationFormFilteredItems;
        }

        return this.donatedItemsListToFilter.filter(donation => {
            const values = Object.values(donation);
            return values.find(value => {
                if ((typeof value).toString() !== 'string') return;
                return value.toLowerCase().includes(this.itemsSearchString.toLowerCase());
            });
        });
    }

    get donationFormFilteredItems(): DonationList[] {
        if (this.formOfDonationFilter === 'all-items') {
            return this.donations;
        }

        return this.donations.filter((donation: DonationList) => {
            if (donation.donationForm) {
                return donation.donationForm.toLowerCase().match(this.formOfDonationFilter.toLowerCase());
            }
            return;
        });
    }

    get dateFilteredItems(): DonationList[] {
        return this.donationFormFilteredItems.filter(item => {
            if (this.fromDate && !this.toDate) {
                return new Date(item.transactionDate) >= new Date(this.fromDate);
            }

            if (this.toDate && !this.fromDate) {
                return new Date(item.transactionDate) <= new Date(this.toDate);
            }

            if (this.fromDate && this.toDate) {
                return (
                    new Date(item.transactionDate) >= new Date(this.fromDate) &&
                    new Date(item.transactionDate) <= new Date(this.toDate)
                );
            }
            return item;
        });
    }

    get searchMatchFound() {
        if (this.itemsSearchString.length == 0) return true;
        if (this.itemsSearchString.length > 0 && this.donations.length < 1) return true;
        return this.donations.length > 0 && this.donationsToBeDisplayed.length > 0;
    }

    get donatedItemsRequestStatus(): string {
        return this.donationRequestStatus.getDonations;
    }

    get itemsExportData(): DonationExport[] {
        return this.donationsToBeDisplayed.map((donation: DonationList) => ({
            ...donation,
            amount: donation.amount ? this.$options.filters.amountWithCurrency(donation.amount) : '',
            transactionDate: this.$options.filters.monthDateYearFormat(donation.transactionDate),
            pledgeDueDate: donation.pledgeDueDate
                ? this.$options.filters.monthDateYearFormat(donation.pledgeDueDate)
                : '',
        }));
    }

    private showModal() {
        this.$bvModal.show(this.modalId);
    }

    private hideModal() {
        this.$bvModal.hide(this.modalId);
    }

    private dismissModal() {
        setTimeout(() => {
            this.hideModal();
        }, 1000);
    }

    private updateSearchString(searchString: string) {
        this.itemsSearchString = searchString;
    }

    private addItemValue(donatedItem: Donation) {
        this.pledgeIsBeingRedeemed = true;
        this.selectedItem = Object.assign(this.selectedItem, donatedItem);
        this.showModal();
    }

    private updateItemTypeFilter(formOfDonation: string) {
        this.formOfDonationFilter = formOfDonation;
    }

    private updateitemsSearchString(searchString: string) {
        this.itemsSearchString = searchString;
    }

    private setFromDateFilter(date: string) {
        this.fromDate = date;
    }

    private setToDateFilter(date: string) {
        this.toDate = date;
    }

    private async getAllPledgeDonations() {
        await donationModule.getDonations();
    }

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Manage Donated Items/Services');
    }

    private goToNewDonationPage() {
        this.$router.push({ name: 'NewDonation' });
    }

    mounted() {
        donationModule = getModule(DonationModule, this.$store);

        this.getAllPledgeDonations();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/donors/index.scss';
</style>
