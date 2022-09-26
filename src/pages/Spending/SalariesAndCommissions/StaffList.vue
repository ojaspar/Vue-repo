<template>
    <div v-if="staffListToShowIsNotEmpty" :class="avatarContainerClass">
        <transition-group name="fade">
            <AvatarAndResource
                v-for="staff in staffListToShow"
                :key="staff.staffPaymentKey"
                :resourceName="staff.staffName"
                :itemKey="staff.staffPaymentKey"
                :expandedItemKey="expandedStaffKey"
                @full-details-toggled="toggleStaff"
                @resource-selected="showFilledStaffForm(staff)"
            >
                <template v-slot:drop-down>
                    <b-col class="staff__details">
                        <div class="staff__details--bio payment">
                            <p class="text--grey">
                                <span class="payment__amount">{{ staff.lastAmountPaid | amountWithCurrency }} </span>
                                <i class="payment__date">{{ new Date(staff.lastDatePaid) | abbreviateMonth }}</i>
                            </p>
                            <p class="text--grey" v-if="staffHasAPhoneNumber(staff)" key="phone">
                                {{ staff.phoneNumber }}
                            </p>
                            <div class="avatar-and-resource__actions-container">
                                <p
                                    class="text--black avatar-and-resource__action"
                                    @click.stop="showFilledStaffForm(staff)"
                                >
                                    <img src="@/assets/img/select-resource.svg" class="mr-3" />Select Staff
                                </p>
                            </div>
                        </div>
                    </b-col>
                </template>
            </AvatarAndResource>
        </transition-group>
    </div>
    <div v-else>
        <div class="select-staff__no-staff-created-yet" v-if="noMatchFoundForSearchString">
            <p>The name "{{ searchString }}" did not match any staff record</p>
            <p>Click the <b>Add New</b> link above if you want to add it now</p>
        </div>
        <div class="select-staff__no-staff-created-yet" v-else>
            <p>Looks like You haven't added any staff yet</p>
            <p>Click the <b>Add New</b> link above to get started</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { isEmpty } from '@/utils/formValidator';
import { Staff } from '@/pages/Spending/SalariesAndCommissions/types';

@Component
export default class StaffList extends Vue {
    @Prop({ default: Array<Staff>() }) staffListForPayment!: Staff[];
    @Prop({ default: '' }) searchString!: string;
    private expandedStaffKey = '';

    get staffListToShowIsNotEmpty(): boolean {
        return this.staffListToShow.length > 0;
    }

    get noMatchFoundForSearchString(): boolean {
        const { staffListToShow, searchString } = this;

        // check if the search contains some text and then staff list is empty because the text didn't match it
        const stringProvidedDidNotMatchAnyRecord = staffListToShow.length === 0 && !isEmpty(searchString);

        if (stringProvidedDidNotMatchAnyRecord) {
            this.$emit('no-match-found');
        }

        return stringProvidedDidNotMatchAnyRecord;
    }

    private staffHasAPhoneNumber(staff: Staff): boolean {
        return staff.phoneNumber.length > 0;
    }

    get sortedStaffList(): Staff[] {
        return this.staffListForPayment.sort((staffA: Staff, staffB: Staff) => {
            if (staffA.staffName.toUpperCase() > staffB.staffName.toUpperCase()) {
                return 1;
            }

            if (staffA.staffName.toUpperCase() < staffB.staffName.toUpperCase()) {
                return -1;
            }

            return 0;
        });
    }

    get staffListToShow(): Staff[] {
        const searchStringInLowerCase = this.searchString.toLowerCase();

        return this.sortedStaffList.filter((staff: Staff) =>
            staff.staffName.toLowerCase().match(searchStringInLowerCase),
        );
    }

    get avatarContainerClass(): string {
        // return !this.userIsOnTablet ? 'avatar-and-resource__container' : '';
        return 'avatar-and-resource__container';
    }

    private showFilledStaffForm(selectedStaff: Staff) {
        this.$emit('staff-selected-for-payment', selectedStaff);
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
