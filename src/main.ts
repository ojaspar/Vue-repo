import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import Component from 'vue-class-component';

Component.registerHooks(['beforeRouteEnter', 'beforeRouteUpdate', 'beforeRouteLeave']);

import App from '@/App.vue';

import router from '@/router';
import store from '@/store';

import '@/globals';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

import '@/styles/main.scss';

import '@/registerServiceWorker';

import BusinessMixin from '@/mixins/businessMixin';

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
    router,
    data: {
        windowWidth: window.innerWidth,
        showFullPageLoader: false,
    },

    mixins: [BusinessMixin],

    computed: {
        isMobileScreenSize(): boolean {
            return this.windowWidth < 768;
        },

        isTabletPortraitSize(): boolean {
            return this.windowWidth >= 768 && this.windowWidth < 992;
        },

        isMediumScreenSize(): boolean {
            return this.windowWidth >= 768 && this.windowWidth < 1200;
        },

        isLargeScreenSize(): boolean {
            return this.windowWidth >= 1200;
        },
    },

    methods: {
        handleResize(): void {
            this.windowWidth = window.innerWidth;
        },
        setFullPageLoaderVisibility(state: boolean): void {
            this.showFullPageLoader = state;
        },
    },

    mounted() {
        window.addEventListener('resize', this.handleResize);
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
    },

    store,
    render: h => h(App),
}).$mount('#app');
