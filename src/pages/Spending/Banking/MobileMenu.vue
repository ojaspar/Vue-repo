<template>
    <div class="mobile-menu">
        <div :style="menuOptionsStyle">
            <b-row class="mobile-menu__row">
                <div>
                    <BasePrimaryButton
                        :overRideButtonClass="true"
                        :buttonText="'Move Funds'"
                        className="mobile-menu__button"
                        @button-clicked="$emit('fund-transfer-button-clicked')"
                    />
                </div>
                <span class="ml-2">
                    <img
                        src="@/assets/img/circled-transfer.svg"
                        class="pointer"
                        @click="$emit('fund-transfer-button-clicked')"
                    />
                </span>
            </b-row>

            <b-row class="mobile-menu__row mt-4">
                <div>
                    <BasePrimaryButton
                        :overRideButtonClass="true"
                        :buttonText="'Add Bank Account'"
                        className="mobile-menu__button"
                        @button-clicked="$emit('add-bank-button-clicked')"
                    />
                </div>
                <span class="ml-2">
                    <img
                        src="@/assets/img/circled-plus.svg"
                        class="pointer"
                        @click="$emit('add-bank-button-clicked')"
                    />
                </span>
            </b-row>
        </div>
        <b-row class="mobile-menu__row mt-4">
            <span>
                <img v-if="showMenuOptions" src="@/assets/img/circled-close.svg" @click="toggleMenuOptions" />
                <img v-else src="@/assets/img/circled-elipsis-h.svg" @click="toggleMenuOptions" />
            </span>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class MoblieMenu extends Vue {
    private showMenuOptions = false;

    get menuOptionsStyle() {
        return this.showMenuOptions ? { visibility: 'visible' } : { visibility: 'hidden' };
    }

    private toggleMenuOptions() {
        this.showMenuOptions = !this.showMenuOptions;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/mobile-menu';
</style>
