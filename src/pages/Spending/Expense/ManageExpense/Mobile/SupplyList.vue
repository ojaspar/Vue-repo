<template>
    <div>
        <div class="manage-sale-index__payments-list">
            <span class="manage-sale-index__mid-section-text--blue manage-sale-index__supply-list--date"
                >21st September 2020</span
            >
            <div class="manage-sale-index__split-between manage-sale-index__supply-list--payment-details">
                <span class="manage-sale-index__mid-section-text--black">Ankara Trouser</span>
                <span class="manage-sale-index__mid-section-text--black">2 pieces</span>
            </div>
            <div class="manage-sale-index__split-between manage-sale-index__supply-list--payment-details">
                <span class="manage-sale-index__mid-section-text--black">Ankara Trouser</span>
                <span class="manage-sale-index__mid-section-text--black">2 pieces</span>
            </div>
            <div class="manage-sale-index__split-between manage-sale-index__supply-list--payment-detailsl">
                <span class="manage-sale-index__mid-section-text--black">Ankara Trouser</span>
                <span class="manage-sale-index__mid-section-text--black">2 pieces</span>
            </div>
        </div>
        <div class="manage-sale-index__supply-list">
            <span class="manage-sale-index__mid-section-text--blue manage-sale-index__supply-list--date"
                >22nd September 2020</span
            >
            <div class="manage-sale-index__split-between manage-sale-index__supply-list--payment-details">
                <span class="manage-sale-index__mid-section-text--black">Ankara Trouser</span>
                <span class="manage-sale-index__mid-section-text--black">2 pieces</span>
            </div>
            <div class="manage-sale-index__split-between manage-sale-index__supply-list--payment-details">
                <span class="manage-sale-index__mid-section-text--black">Ankara Trouser</span>
                <span class="manage-sale-index__mid-section-text--black">2 pieces</span>
            </div>
            <div class="manage-sale-index__split-between manage-sale-index__supply-list--payment-detailsl">
                <span class="manage-sale-index__mid-section-text--black">Ankara Trouser</span>
                <span class="manage-sale-index__mid-section-text--black">2 pieces</span>
            </div>
        </div>
        <div class="manage-sale-index__supply-list">
            <span class="manage-sale-index__mid-section-text--blue manage-sale-index__supply-list--date"
                >23rd September 2020</span
            >
            <div class="manage-sale-index__split-between manage-sale-index__supply-list--payment-details">
                <span class="manage-sale-index__mid-section-text--black">Ankara Trouser</span>
                <span class="manage-sale-index__mid-section-text--black">2 pieces</span>
            </div>
            <div class="manage-sale-index__split-between manage-sale-index__supply-list--payment-details">
                <span class="manage-sale-index__mid-section-text--black">Ankara Trouser</span>
                <span class="manage-sale-index__mid-section-text--black">2 pieces</span>
            </div>
            <div class="manage-sale-index__split-between manage-sale-index__supply-list--payment-detailsl">
                <span class="manage-sale-index__mid-section-text--black">Ankara Trouser</span>
                <span class="manage-sale-index__mid-section-text--black">2 pieces</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PaymentsList extends Vue {}
</script>

<style lang="scss">
.manage-sale-index {
    &__supply-list {
        border-bottom: 1px solid $faint-grey;
        padding: 10px 0;
        &--date {
            display: inline-block;
            margin-bottom: 15px;
        }
        &--payment-details {
            margin-bottom: 10px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>
