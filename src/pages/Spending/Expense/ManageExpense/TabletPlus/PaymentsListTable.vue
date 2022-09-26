<template>
    <b-container fluid>
        <b-row class="ms-tablet-plus-index__mid-section-table-header">
            <b-col cols="1">
                #
            </b-col>
            <b-col cols="3">
                Date
            </b-col>
            <b-col cols="4">
                Bank / Account Number
            </b-col>
            <b-col cols="4">
                Amount
            </b-col>
        </b-row>
        <b-row class="ms-tablet-plus-index__mid-section-table-body">
            <b-col cols="1">
                1
            </b-col>
            <b-col cols="3">
                21st Sept, 2020
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__payments-list-bank-details">
                <p class="ms-tablet-plus-index__payments-list-bank-details-text">Access Bank - 1025469874</p>
                <p class="ms-tablet-plus-index__payments-list-bank-details-text">Access Bank - 1025469874</p>
                <p class="ms-tablet-plus-index__payments-list-bank-details-text">Access Bank - 1025469874</p>
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__payments-list-amount">
                <p class="ms-tablet-plus-index__payments-list-amount">₦ 17,200</p>
                <p class="ms-tablet-plus-index__payments-list-amount">₦ 17,200</p>
                <p class="ms-tablet-plus-index__payments-list-amount">₦ 17,200</p>
            </b-col>
        </b-row>
        <b-row class="ms-tablet-plus-index__mid-section-table-body">
            <b-col cols="1">
                2
            </b-col>
            <b-col cols="3">
                22nd Sept, 2020
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__payments-list-bank-details">
                <p class="ms-tablet-plus-index__payments-list-bank-details-text">Access Bank - 1025469874</p>
                <p class="ms-tablet-plus-index__payments-list-bank-details-text">Access Bank - 1025469874</p>
                <p class="ms-tablet-plus-index__payments-list-bank-details-text">Access Bank - 1025469874</p>
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__payments-list-amount">
                <p class="ms-tablet-plus-index__payments-list-amount">₦ 17,200</p>
                <p class="ms-tablet-plus-index__payments-list-amount">₦ 17,200</p>
                <p class="ms-tablet-plus-index__payments-list-amount">₦ 17,200</p>
            </b-col>
        </b-row>
        <b-row class="ms-tablet-plus-index__mid-section-table-body">
            <b-col cols="1">
                3
            </b-col>
            <b-col cols="3">
                23rd Sept, 2020
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__payments-list-bank-details">
                <p class="ms-tablet-plus-index__payments-list-bank-details-text">Access Bank - 1025469874</p>
                <p class="ms-tablet-plus-index__payments-list-bank-details-text">Access Bank - 1025469874</p>
                <p class="ms-tablet-plus-index__payments-list-bank-details-text">Access Bank - 1025469874</p>
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__payments-list-amount">
                <p class="ms-tablet-plus-index__payments-list-amount">₦ 17,200</p>
                <p class="ms-tablet-plus-index__payments-list-amount">₦ 17,200</p>
                <p class="ms-tablet-plus-index__payments-list-amount">₦ 17,200</p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ProductsListTable extends Vue {}
</script>

<style lang="scss">
.ms-tablet-plus-index {
    &__payments-list-bank-details-text {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    &__payments-list-amount {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
