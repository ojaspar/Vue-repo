<template>
    <b-container fluid class="p-0 add-loan-page">
        <b-row class="add-loan-page__content">
            <LoanForm />
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import LoanForm from '@/pages/Financing/Loan/AddLoan/LoanForm.vue';

@Component({ components: { LoanForm } })
export default class AddLoanIndex extends Vue {
    private goToFinancingDashboard() {
        this.$router.push({ name: 'Financing' });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/loan/add-loan-index';
</style>
