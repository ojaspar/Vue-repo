import Vue from 'vue';
import Vuex from 'vuex';

import auth from '@/store/modules/auth';
import business from '@/store/modules/business';
import customer from '@/store/modules/customer';
import product from '@/store/modules/product';
import expense from '@/store/modules/expense';
import general from '@/store/modules/general';
import vendor from '@/store/modules/vendor';
import sale from '@/store/modules/sale';
import dashboard from '@/store/modules/dashboard';
import report from '@/store/modules/report';
import salariesAndCommissions from '@/store/modules/salariesAndCommissions';
import bank from '@/store/modules/bank';
import donation from '@/store/modules/donation';
import finance from '@/store/modules/finance';
import payroll from '@/store/modules/payroll';
import tax from '@/store/modules/tax';
import inventory from '@/store/modules/inventory';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    getters: {},
    actions: {},
    modules: {
        auth,
        business,
        customer,
        product,
        expense,
        payroll,
        general,
        vendor,
        sale,
        dashboard,
        report,
        salariesAndCommissions,
        bank,
        donation,
        finance,
        tax,
        inventory,
    },
});
