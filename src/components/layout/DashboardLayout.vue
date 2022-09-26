<template>
    <div class="body-layout">
        <div class="header-section"></div>
        <div class="dashboard-layout" :class="[sidebarCollapsed && 'dashboard-layout__with-collapsed-sidebar']">
            <header class="header">
                <TheNavbar
                    :authenticatedUser="authenticatedUser"
                    :notifications="notifications"
                    :pageTitle="pageTitle"
                    :activeComponentIndex="activeComponentIndexEmittedFromComponent"
                    :isBackButtonToShowInThisRoute="isBackButtonToShowInThisRoute"
                    :showCart="showCart"
                    :cartCount="cartCount"
                    :leftIcon="leftIcon"
                    @hamburger-icon-clicked="openSidebar"
                    @back-button-clicked="setBackButtonState"
                    @cancel-button-clicked="setCancelButtonState"
                    @cart-button-clicked="setCartButtonState"
                />
            </header>

            <aside
                v-if="$root.isMobileScreenSize"
                tabindex="0"
                ref="sidebar"
                :class="[isMobileSidebarClosed ? 'inactive' : 'active', 'sidenav']"
                @blur="handleClickOutsideOfMobileSidebar"
            >
                <TheSidebar @close-sidebar-button-clicked="closeSidebar" />
            </aside>

            <SideBar
                v-else
                :class="[
                    'sidebar',
                    currentRouteIsNotDashboard && 'sidebar__module',
                    sidebarCollapsed && 'sidebar__module--collapsed',
                ]"
                :authenticatedUser="authenticatedUser"
                :collapsed="sidebarCollapsed"
                @collapse-sidebar="toggleSidebarCollapse"
            />

            <main class="main-content">
                <slot />
            </main>

            <transition name="fade">
                <footer class="footer-layout" v-if="showMobileFooter">
                    <TheMobileFooter :activeLinkName="activeLinkName" />
                </footer>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import TheNavbar from '@/components/layout/TheNavbar.vue';
import TheSidebar from '@/components/layout/TheSideBar.vue';
import SideBar from '@/components/layout/SideBar.vue';
import TheMobileFooter from '@/components/layout/TheMobileFooter.vue';
import GeneralModule from '@/store/modules/general';

import SessionStorageService from '@/services/sessionStorage';
import AuthenticationService from '@/services/authentication';

import { ensurePossiblyNullValueReturnsString, VueExtension } from '@/types';

const generals = namespace('general');
let generalModule: GeneralModule;

@Component({
    components: {
        TheNavbar,
        TheSidebar,
        TheMobileFooter,
        SideBar,
    },
})
export default class DashboardLayout extends Vue {
    private authenticatedUser = {};
    private activeLinkName = 'Dashboard';
    private notifications = [];
    private isMobileSidebarClosed = true;
    private isBackButtonToShowInThisRoute = false;
    private showCart = false;
    private leftIcon = '';
    private activeComponentIndexEmittedFromComponent = 0;
    private pageTitle = '';
    private cartCount = 0;
    private displayMobileFooter = true;
    private sidebarCollapsed = false;

    $refs!: {
        sidebar: HTMLFormElement;
    };

    @generals.State
    private inputFieldIsFocusedOn!: boolean;

    public $root!: VueExtension;

    get showMobileFooter() {
        return this.$root.isMobileScreenSize && this.displayMobileFooter;
    }

    get currentRouteIsNotDashboard(): boolean {
        return this.$route?.name !== 'Dashboard';
    }

    public closeSidebar() {
        this.isMobileSidebarClosed = true;
    }

    public openSidebar() {
        // focus on the sidebar (aside element) when it's opened so that the blur effect will occur when a click
        // occurs outside it
        this.$refs.sidebar.focus();
        this.isMobileSidebarClosed = false;
    }

    public async setActiveComponentIndex(activeComponentIndex: number) {
        this.activeComponentIndexEmittedFromComponent = activeComponentIndex;
    }

    public async setBackButtonIsToShowInThisRouteProp(backButtonIsToShowInThisRouteProp: boolean) {
        this.isBackButtonToShowInThisRoute = backButtonIsToShowInThisRouteProp;
    }

    private setPageTitle(pageTitle: string) {
        this.pageTitle = pageTitle;
    }

    private setShowCart(shouldShow: boolean) {
        this.showCart = shouldShow;
    }

    private setLeftIcon(icon: string) {
        this.leftIcon = icon;
    }

    private setCartCount(count: number) {
        this.cartCount = count;
    }

    private handleChildComponentEvents() {
        this.$on('active-component-index', this.setActiveComponentIndex);
        this.$on('is-back-button-to-be-shown-in-this-route', this.setBackButtonIsToShowInThisRouteProp);
        this.$on('update-page-title', this.setPageTitle);
        this.$on('set-cart-count', this.setCartCount);
        this.$on('set-show-cart', this.setShowCart);
        this.$on('set-left-icon', this.setLeftIcon);
    }

    private setBackButtonState() {
        generalModule.setMobileBackButtonState(true);
    }

    private setCancelButtonState() {
        generalModule.setMobileCancelButtonState(true);
    }

    private setCartButtonState() {
        generalModule.setMobileCartButtonState(true);
    }

    private handleClickOutsideOfMobileSidebar() {
        if (!this.isMobileSidebarClosed && this.$root.isMobileScreenSize) {
            this.closeSidebar();
        }
    }

    private toggleSidebarCollapse() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    @Watch('inputFieldIsFocusedOn')
    handleFocusOnInut(isFocused: boolean) {
        if (isFocused) {
            this.displayMobileFooter = false;
            return;
        }
        this.displayMobileFooter = true;
    }

    @Watch('$root.windowWidth')
    @Watch('$route')
    expandSidebar() {
        if (this.$root.isLargeScreenSize || !this.currentRouteIsNotDashboard) this.sidebarCollapsed = false;
    }

    created() {
        this.handleChildComponentEvents();
    }

    mounted() {
        this.activeLinkName = ensurePossiblyNullValueReturnsString(this.$route.name);
        this.authenticatedUser = SessionStorageService.decodeToken();

        AuthenticationService.startAutologoutService();

        generalModule = getModule(GeneralModule, this.$store);
    }
}
</script>

<style lang="scss">
@import 'src/styles/layout/dashboard';
</style>
