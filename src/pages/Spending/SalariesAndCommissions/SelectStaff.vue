<template>
    <div class="select-staff">
        <ListSearchAndAddBar
            buttonText="Add New"
            placeholder="Search for Staff"
            @search-input-changed="updateSearchString"
            @add-new-resource="showEmptyAddStaffForm"
        />

        <p class="select-staff__headline" v-if="showHeadline">All Staff</p>
        <div class="staff-list">
            <StaffList
                v-if="paymentAndCommissionRequestIsLoading"
                :staffListForPayment="staffListForPayment"
                :searchString="searchString"
                @staff-selected-for-payment="showFilledStaffForm"
                @no-match-found="handleNoMatchFoundForSearchString"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import PlusSign from '@/components/ui/PlusSign.vue';
import StaffList from '@/pages/Spending/SalariesAndCommissions/StaffList.vue';

import SalariesAndCommissionsModule from '@/store/modules/salariesAndCommissions';

import { Staff, SalariesAndCommissionRequestStatus } from '@/pages/Spending/SalariesAndCommissions/types';
import { Status } from '@/types';

const salariesAndCommissions = namespace('salariesAndCommissions');
let salariesAndCommissionsModule: SalariesAndCommissionsModule;

@Component({
    components: {
        PlusSign,
        StaffList,
    },
})
export default class SelectStaff extends Vue {
    private searchString = '';
    private showHeadline = true;

    @salariesAndCommissions.State
    private salariesAndCommissionRequestStatus!: SalariesAndCommissionRequestStatus;

    @salariesAndCommissions.State
    private staffListForPayment!: Array<Staff>;

    get paymentAndCommissionRequestIsLoading(): boolean {
        return this.salariesAndCommissionRequestStatus.getStaffListForPayment === Status.LOADING;
    }

    private showEmptyAddStaffForm() {
        this.$emit('show-empty-staff-payment-form', this.searchString);
    }

    private showFilledStaffForm(selectedStaff: Staff) {
        this.$emit('show-filled-staff-payment-form', selectedStaff);
    }

    private updateSearchString(searchString: string) {
        this.searchString = searchString;
    }

    private handleNoMatchFoundForSearchString() {
        // we want to hide the headline that reads `all Staff` since the list is empty
        this.showHeadline = false;
    }

    mounted() {
        salariesAndCommissionsModule = getModule(SalariesAndCommissionsModule, this.$store);
        salariesAndCommissionsModule.getStaffListForPayment();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/salaries-commissions/staff-list';
</style>
