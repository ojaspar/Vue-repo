<template>
    <ul class="mobile-footer">
        <li
            class="mobile-footer__nav-item"
            v-for="(link, index) in links"
            :key="index"
            @click="goToRoute(link.routeName)"
            :style="{ color: iconColorClass(link.routeName) }"
        >
            <IconBase :iconName="link.icon" class="mobile-footer__nav-item--icon" />

            <p class="mobile-footer__nav-item--text">{{ link.text }}</p>
        </li>
    </ul>
</template>

<script lang="ts">
import { Prop, Component, Mixins } from 'vue-property-decorator';

import { MenuItem } from '@/types';

import UtilityMixins from '@/mixins/Utility';

const colorMap = new Map();
colorMap.set('dashboard', '#0d7494');
colorMap.set('recordsale', '#52C41A');
colorMap.set('recordexpense', '#cf1322');
colorMap.set('more', '#f2994a');

@Component
export default class MobileFooter extends Mixins(UtilityMixins) {
    private moreOptionsModal = 'more-options-modal';

    private links: Array<MenuItem> = [
        {
            text: 'Home',
            icon: 'home',
            routeName: 'Dashboard',
        },
        {
            text: this.userIsOnTabletPortrait ? 'New Sale' : 'Record Sale',
            icon: 'record-new',
            routeName: 'RecordSale',
        },
        {
            text: this.userIsOnTabletPortrait ? 'New Expense' : 'Record Expense',
            icon: 'record-expense',
            routeName: 'RecordExpense',
        },
        {
            text: 'More',
            icon: 'more-options',
            routeName: 'more',
        },
    ];

    @Prop({ default: 'Dashboard' }) readonly activeLinkName!: string;

    private goToRoute(routeName: string) {
        // if the routeName is empty, then we know it is the sub menu button that was clicked
        if (routeName === 'more') {
            this.$bvModal.show(this.moreOptionsModal);

            return;
        }

        this.$router.push({ name: routeName });
    }

    private iconColorClass(routeName: string): string {
        return colorMap.get(routeName.toLowerCase());
    }
}
</script>

<style lang="scss">
.mobile-footer {
    display: flex;
    margin-bottom: 0;
    justify-content: space-around;
    padding: 8px 0;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12);

    &__icon {
        width: 25px;
        height: 25px;
    }

    &__nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        color: $primary-black;

        &--icon {
            height: 31px;
            width: 28px;
        }

        &--text {
            font-size: 14px;

            margin-bottom: 0;
        }
    }

    &__nav-link {
        text-decoration: none;
        color: $dark-grey-1;

        margin-top: 3px;

        &:hover {
            outline: none;
        }
    }

    &__nav-item-text {
        font-size: 12px;
    }

    &__active-route {
        color: $primary-color;
        font-weight: 600;
    }
}
</style>
