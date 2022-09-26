<template>
    <SuccessPage>
        <BaseSecondaryButton
            buttonText="Expense History"
            @button-clicked="$emit('view-expenses')"
            className="success-page__btn success-page__btn--receipt success-page__btn--white"
        />
        <BasePrimaryButton
            buttonText="New Expense"
            @button-clicked="$emit('record-new-expense')"
            className="success-page__btn success-page__btn--blue"
        />
    </SuccessPage>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ExpenseSuccessPage extends Vue {}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/vendor-card';
</style>
