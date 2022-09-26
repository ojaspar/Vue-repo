<template>
    <div>
        <div class="donations-mid-section__desktop-view">
            <b-row class="donations-mid-section-container">
                <b-col xl="8" lg="12" cols="12" class="donations-mid-section__search-and-dates p-0">
                    <div class="donations-mid-section__search--container">
                        <font-awesome-icon icon="search" class="donations-mid-section__search--icon" />
                        <BaseInputField
                            :placeholder="searchInputPlaceholder"
                            @input="handleSearchInput"
                            class="donations-mid-section__search--input"
                        />
                    </div>
                    <div class="donations-mid-section__dates">
                        <div class="donations-mid-section__dates--from">
                            <BaseDateFieldWithBorderAndFloatingLabel
                                floatingLabelText="From"
                                :overRideInputContainerClass="true"
                                inputContainerClass="donations-mid-section__dates--container"
                                className="dates__input"
                                @change="handleFromDateChange"
                            />
                        </div>
                        <div class="dates__to">
                            <BaseDateFieldWithBorderAndFloatingLabel
                                floatingLabelText="To"
                                :overRideInputContainerClass="true"
                                inputContainerClass="donations-mid-section__dates--container"
                                className="dates__input"
                                @change="handleToDateChange"
                            />
                        </div>
                    </div>
                </b-col>

                <b-col class="donations-mid-section__buttons">
                    <DownloadCsv :data="exportData" name="donations.csv">
                        <BaseSecondaryButton buttonText="Export to csv" class="mr-2" />
                    </DownloadCsv>
                </b-col>
            </b-row>
        </div>

        <div class="donations-mid-section__mobile-view">
            <b-row class="donations-mid-section-container">
                <div class="donations-mid-section__search">
                    <b-col cols="12" class="donations-mid-section__search--container">
                        <font-awesome-icon icon="search" class="search-icon" />
                        <BaseInputField
                            :placeholder="searchInputPlaceholder"
                            class="search-input"
                            :value="searchStringValue"
                            @input="handleSearchInput"
                        />
                    </b-col>
                </div>
            </b-row>

            <b-row class="d-flex mt-4">
                <b-col class="mobile-dates-container">
                    <BaseDateFieldWithBorderAndFloatingLabel
                        :overRideInputContainerClass="true"
                        inputContainerClass="date-input"
                        floatingLabelText="From"
                        @change="handleFromDateChange"
                    />
                    <BaseDateFieldWithBorderAndFloatingLabel
                        :overRideInputContainerClass="true"
                        inputContainerClass="date-input"
                        floatingLabelText="To"
                        @change="handleToDateChange"
                    />
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { defaultDonationExport, DonationExport } from '@/pages/Donations/types';

@Component
export default class DashboardMidSection extends Vue {
    @Prop({ default: '' }) readonly searchStringValue!: string;
    @Prop({ default: 'Search for donations' }) readonly searchInputPlaceholder!: string;
    @Prop({ default: () => Array<DonationExport>({ ...defaultDonationExport }) })
    readonly exportData!: DonationExport[];

    private handleSearchInput(searchInput: string) {
        this.$emit('search-input-changed', searchInput);
    }

    private handleFromDateChange(date: string) {
        this.$emit('from-date-filter-has-changed', date);
    }

    private handleToDateChange(date: string) {
        this.$emit('to-date-filter-has-changed', date);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/dashboard/donations-dashboard-mid-section';
</style>
