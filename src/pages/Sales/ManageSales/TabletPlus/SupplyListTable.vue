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
                Item
            </b-col>
            <b-col cols="4">
                No. of Items
            </b-col>
        </b-row>
        <b-row class="ms-tablet-plus-index__mid-section-table-body">
            <b-col cols="1">
                1
            </b-col>
            <b-col cols="3">
                21st Sept, 2020
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__supply-list-bank-details">
                <p class="ms-tablet-plus-index__supply-list-bank-details-text">Ankara Trouser</p>
                <p class="ms-tablet-plus-index__supply-list-bank-details-text">Ankara Trouser</p>
                <p class="ms-tablet-plus-index__supply-list-bank-details-text">Ankara Trouser</p>
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__supply-list-amount">
                <p class="ms-tablet-plus-index__supply-list-amount">2 pieces</p>
                <p class="ms-tablet-plus-index__supply-list-amount">2 pieces</p>
                <p class="ms-tablet-plus-index__supply-list-amount">2 pieces</p>
            </b-col>
        </b-row>
        <b-row class="ms-tablet-plus-index__mid-section-table-body">
            <b-col cols="1">
                2
            </b-col>
            <b-col cols="3">
                22nd Sept, 2020
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__supply-list-bank-details">
                <p class="ms-tablet-plus-index__supply-list-bank-details-text">Ankara Trouser</p>
                <p class="ms-tablet-plus-index__supply-list-bank-details-text">Ankara Trouser</p>
                <p class="ms-tablet-plus-index__supply-list-bank-details-text">Ankara Trouser</p>
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__supply-list-amount">
                <p class="ms-tablet-plus-index__supply-list-amount">2 pieces</p>
                <p class="ms-tablet-plus-index__supply-list-amount">2 pieces</p>
                <p class="ms-tablet-plus-index__supply-list-amount">2 pieces</p>
            </b-col>
        </b-row>
        <b-row class="ms-tablet-plus-index__mid-section-table-body">
            <b-col cols="1">
                3
            </b-col>
            <b-col cols="3">
                23rd Sept, 2020
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__supply-list-bank-details">
                <p class="ms-tablet-plus-index__supply-list-bank-details-text">Ankara Trouser</p>
                <p class="ms-tablet-plus-index__supply-list-bank-details-text">Ankara Trouser</p>
                <p class="ms-tablet-plus-index__supply-list-bank-details-text">Ankara Trouser</p>
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__supply-list-amount">
                <p class="ms-tablet-plus-index__supply-list-amount">2 pieces</p>
                <p class="ms-tablet-plus-index__supply-list-amount">2 pieces</p>
                <p class="ms-tablet-plus-index__supply-list-amount">2 pieces</p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class SupplyListTable extends Vue {}
</script>

<style lang="scss">
.ms-tablet-plus-index {
    &__supply-list-bank-details-text {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    &__supply-list-amount {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
