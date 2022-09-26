<template>
    <div>
        <div class="mid-section__desktop-view">
            <b-row class="mid-section-container">
                <b-col xl="8" lg="12" cols="12" class="mid-section__search-and-dates p-0">
                    <div class="mid-section__search--container">
                        <font-awesome-icon icon="search" class="mid-section__search--icon" />
                        <BaseInputField
                            :placeholder="searchInputPlaceholder"
                            @input="handleSearchInput"
                            class="mid-section__search--input"
                        />
                    </div>
                    <div class="mid-section__dates">
                        <BaseDateFieldWithBorderAndFloatingLabel
                            floatingLabelText="From"
                            :overRideInputContainerClass="true"
                            inputContainerClass="mid-section__dates--container"
                            className="dates__input"
                            @change="handleFromDateChange"
                        />
                        <BaseDateFieldWithBorderAndFloatingLabel
                            floatingLabelText="To"
                            :overRideInputContainerClass="true"
                            inputContainerClass="mid-section__dates--container"
                            className="dates__input"
                            @change="handleToDateChange"
                        />
                    </div>
                </b-col>

                <!-- Add New Donation -->
                <b-col class="mid-section__buttons">
                    <BasePrimaryButton
                        :buttonText="buttonName"
                        :overRideButtonClass="true"
                        className="mid-section-btn"
                        @button-clicked="$emit('button-clicked')"
                    />
                </b-col>
            </b-row>
        </div>
        <div class="mid-section__mobile-view">
            <b-row class="mid-section-container">
                <div class="mid-section__search">
                    <b-col cols="12" class="mid-section__search--container">
                        <font-awesome-icon icon="search" class="mid-section__search-icon" />
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

@Component
export default class TransactionPageMidSection extends Vue {
    @Prop({ default: '' }) readonly searchStringValue!: string;
    @Prop({ default: 'Search for customer/product' }) readonly searchInputPlaceholder!: string;
    @Prop({ default: 'Add New' }) readonly buttonName!: string;

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
@import 'src/styles/components/transaction-page-mid-section';
</style>
