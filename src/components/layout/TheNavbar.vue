<template>
    <b-container fluid class="m-0 p-0 h-100">
        <div class="h-100 mobile-navbar m-0 align-items-center" v-if="this.$root.isMobileScreenSize">
            <div class="p-0">
                <img
                    src="@/assets/img/back-button-white.svg"
                    @click="$emit('back-button-clicked')"
                    class="pointer"
                    v-if="showBackButton"
                />
                <img
                    src="@/assets/img/white-cancel-icon.svg"
                    @click="$emit('cancel-button-clicked')"
                    class="pointer"
                    v-else-if="showCancelButton"
                />
                <div v-else-if="showHamburger">
                    <font-awesome-icon icon="bars" class="mobile-navbar__hamburger-icon" @click="openSidebar" />
                </div>
            </div>

            <div class="mobile-navbar__page-title">{{ getPageTitle }}</div>

            <div class="mobile-navbar__right">
                <div
                    v-if="showCart"
                    @click="$emit('cart-button-clicked')"
                    class="mobile-navbar__cart-container pointer"
                >
                    <img src="@/assets/img/shopping-cart-white.svg" />
                    <span class="mobile-navbar__cart-count" v-if="showCartCount">
                        {{ cartCount }}
                    </span>
                </div>
            </div>

            <!-- <div v-else>
                <img src="@/assets/img/cancel-icon.svg" @click="$emit('cancel-button-clicked')" class="pointer" />
            </div> -->
        </div>

        <b-row v-else class="h-100 top-navbar">
            <section class="top-navbar__left pointer" @click="goToRoute('Dashboard')">
                <img src="@/assets/img/mzuri-bird.svg" class="top-navbar__left--logo" />
            </section>

            <ul class="top-navbar__center">
                <li
                    class="top-navbar__menu-item pointer"
                    v-for="{ text, icon, routeName } in menuItems"
                    :key="text"
                    @click="goToRoute(routeName)"
                    @mousedown="handleMouseDown"
                >
                    <IconBase
                        :iconName="icon"
                        class="top-navbar__menu-item--icon"
                        :iconColor="iconColorClass(routeName)"
                    />

                    <p class="top-navbar__menu-item--text">{{ text }}</p>
                </li>

                <transition name="slide-up-fade">
                    <ul
                        class="top-navbar__center--more-options"
                        v-if="showSubMenuItems"
                        ref="subMenuItems"
                        @blur="hideSubMenuItems"
                        tabindex="1"
                    >
                        <li
                            v-for="menuItem in subMenuItems"
                            :key="menuItem.text"
                            @click="goToRoute(menuItem.routeName)"
                            class="top-navbar__center--more-option-item pointer"
                        >
                            {{ menuItem.text }}
                        </li>
                    </ul>
                </transition>
            </ul>

            <section class="top-navbar__right">
                <article class="top-navbar__right-container">
                    <img
                        src="@/assets/img/search.svg"
                        alt="Search Icon"
                        class="top-navbar__right--search top-navbar__right--icon pointer"
                    />
                    <img
                        src="@/assets/img/notification.svg"
                        class="top-navbar__right--notification top-navbar__right--icon pointer"
                        alt="Notification Icon"
                    />

                    <div
                        @click="toggleShowMoreOptions"
                        @mousedown="handleMouseDown"
                        @mouseenter="setMoreOptionsToTrue"
                        @mouseleave="hideMoreOptions"
                        class="top-navbar__right--more-options-trigger pointer"
                    >
                        <p class="top-navbar__right--business-owner mr-4">{{ authenticatedUser.firstName }}</p>

                        <img
                            src="@/assets/img/caret-down.svg"
                            alt="Caret Down Icon"
                            class="top-navbar__right--more-options-trigger-image top-navbar__right--icon pointer"
                        />

                        <transition name="slide-up-fade">
                            <ul
                                class="top-navbar-options"
                                v-show="showMoreOptions"
                                ref="moreOptions"
                                @blur="hideMoreOptions"
                                tabindex="1"
                            >
                                <li class="top-navbar-option top-navbar-option__business-details">
                                    <p class="top-navbar-option__business-details--avatar">
                                        {{ authenticatedUser.businessName | initials }}
                                    </p>
                                    <p class="top-navbar-option__business-details--name pointer">
                                        {{ authenticatedUser.businessName }}
                                    </p>

                                    <p class="top-navbar-option__business-details--switch-business pointer">
                                        Switch business
                                    </p>
                                </li>

                                <li class="top-navbar-option" @click.stop="goToRoute('UserProfile')">
                                    <IconBase class="top-navbar-option__icon" iconName="settings" />
                                    <p class="top-navbar-option__text">Settings</p>
                                </li>

                                <li class="top-navbar-option">
                                    <IconBase class="top-navbar-option__icon" iconName="help" />
                                    <p class="top-navbar-option__text">Help & Support</p>
                                </li>

                                <li class="top-navbar-option" @click.stop="logout">
                                    <IconBase class="top-navbar-option__icon" iconName="logout" />
                                    <p class="top-navbar-option__text">Logout</p>
                                </li>
                            </ul>
                        </transition>
                    </div>
                </article>
            </section>
        </b-row>

        <BaseModal
            :modalId="moreOptionsModal"
            modalTitle="More Options"
            @hide-modal="hideMoreOptionsModal"
            :fullScreen="true"
        >
            <QuickActions @close="hideMoreOptionsModal" @navigate="handleNavigation" />
        </BaseModal>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import SearchBar from '@/components/ui/SearchBar.vue';

import { User, Notification, LeftIcon, VueExtension, MenuItem, SubMenuItem } from '@/types';

import AuthenticationService from '@/services/authentication';
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import UtilityMixin from '@/mixins/Utility';

const colorMap = new Map();
colorMap.set('dashboard', '#0d7494');
colorMap.set('recordsale', '#52C41A');
colorMap.set('recordexpense', '#cf1322');
colorMap.set('more', '#f2994a');

@Component({
    components: {
        SearchBar,
    },
})
export default class TheNavBar extends Mixins(DynamicComponentMixin, UtilityMixin) {
    @Prop({ default: { businessName: '' } }) readonly authenticatedUser!: User;
    @Prop({ default: [] }) readonly notifications!: Notification[];
    @Prop({ required: true }) readonly activeComponentIndex!: number;
    @Prop({ default: false }) readonly isBackButtonToShowInThisRoute!: boolean;
    @Prop({ default: false }) readonly showCart!: boolean;
    @Prop({ default: 0 }) readonly cartCount!: number;
    @Prop({ default: '' }) readonly leftIcon!: string;
    @Prop({ default: '' }) readonly pageTitle!: string;

    $root!: VueExtension;

    get menuItems(): Array<MenuItem> {
        return [
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
    }

    private subMenuItems: Array<SubMenuItem> = [
        {
            routeName: 'RecordSale',
            text: 'Record Sale',
        },
        {
            routeName: 'RecordExpense',
            text: 'Record Expense',
        },
        {
            routeName: 'PriceQuotation',
            text: 'Price Quotation',
        },
        {
            routeName: 'More',
            text: 'More Options',
        },
    ];

    private showMoreOptions = false;
    private showSubMenuItems = false;

    private moreOptionsModal = 'more-options-modal';

    $refs!: {
        subMenuItems: HTMLFormElement;
        moreOptions: HTMLFormElement;
    };

    get fullName(): string {
        return `${this.authenticatedUser.firstName} ${this.authenticatedUser.lastName}`;
    }

    get showBackButton() {
        return (
            this.leftIcon === LeftIcon.Back ||
            (this.activeComponentIndex > 0 && this.isBackButtonToShowInThisRoute && this.leftIcon === LeftIcon.None)
        );
    }

    get showCartCount() {
        return this.cartCount > 0;
    }

    get showCancelButton() {
        return this.leftIcon === LeftIcon.Cancel;
    }

    get showHamburger() {
        return this.leftIcon === LeftIcon.Hamburger || !this.leftIcon;
    }

    get getPageTitle(): string {
        return this.pageTitle || this.authenticatedUser.businessName;
    }

    get activeLink(): string {
        return this.$route?.meta?.module || this.$route?.name || '';
    }

    private iconColorClass(routeName: string): string {
        return colorMap.get(routeName.toLowerCase());
    }

    private handleMouseDown(event: Event) {
        if (this.showMoreOptions || this.showSubMenuItems) {
            event.preventDefault();
        }
    }

    public openSidebar() {
        this.$emit('hamburger-icon-clicked');
    }

    public logout() {
        AuthenticationService.logoutUser();
    }

    private goToRoute(routeName: string) {
        // if the routeName is empty, then we know it is the sub menu button that was clicked
        if (routeName === 'more') {
            this.showMoreOptionsModal();
            return;
        }

        this.$router.push({ name: routeName });
    }

    private toggleShowMoreOptions() {
        this.showMoreOptions = !this.showMoreOptions;

        this.$nextTick(() => {
            if (this.showMoreOptions) {
                this.$refs.moreOptions.focus();
            }
        });
    }

    private hideMoreOptions() {
        this.showMoreOptions = false;
    }

    private setMoreOptionsToTrue() {
        this.showMoreOptions = true;
        this.$refs.moreOptions.focus();
    }

    private toggleSubMenuItems() {
        this.showSubMenuItems = !this.showSubMenuItems;

        this.$nextTick(() => {
            if (this.showSubMenuItems) {
                this.$refs.subMenuItems.focus();
            }
        });
    }

    private hideSubMenuItems() {
        this.showSubMenuItems = false;
    }

    private handleNavigation(routeName: string) {
        this.hideMoreOptionsModal();

        this.$nextTick(() => {
            this.$router.push({ name: routeName });
        });
    }

    private showMoreOptionsModal() {
        this.$bvModal.show(this.moreOptionsModal);
    }

    private hideMoreOptionsModal() {
        this.cancelModal(this.moreOptionsModal);
    }
}
</script>

<style lang="scss">
@import 'src/styles/layout/the-navbar';
</style>
