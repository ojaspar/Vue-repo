<template>
    <b-container>
        <b-row>
            <b-col class="mt-2 mb-4">
                <InvoiceHeader
                    :customerName="customerName"
                    :selectCustomerSection="selectCustomerSection"
                    :headerText="invoiceHeaderText"
                    v-if="dualEntityHeaderPresent"
                    @change-name-link-clicked="handleNameChange"
                />
            </b-col>
        </b-row>

        <b-row v-if="conditionForDualEntitySectionToNotShow">
            <b-col class="no-entity">
                <img
                    class="no-entity__image"
                    src="@/assets/img/no-product-image-min.png"
                    alt="section not showing image"
                />
                <div class="no-entity__text-btn-section">
                    <h2 class="no-entity__main-text">{{ noEntityMainHeading }}</h2>
                    <p class="no-entity__sub-text">
                        {{ noEntitySubHeading }}
                    </p>
                    <BaseButton className="no-entity__btn" :buttonText="noEntityButtonText" :overRideButtonClass="true">
                        <svg class="no-entity__plus-sign">
                            <use href="@/assets/img/sprites.svg#icon-plus"></use>
                        </svg>
                    </BaseButton>
                </div>
            </b-col>
        </b-row>

        <b-row v-else class="entity-display no-gutters mb-5">
            <b-col cols="12">
                <form class="search-entity position-relative mt-3 mb-3">
                    <BaseInputField
                        className="search-entity__input"
                        inputContainerClass="search-entity__input-container"
                        :placeholder="entitySearchPlaceholder"
                    />

                    <img class="entity-avatar-icon" :src="entitySearchIcon" alt="entity avatar icon" />
                    <BaseButton
                        className="search-entity__btn"
                        :buttonText="entitySearchAddText"
                        :overRideButtonClass="true"
                        @button-clicked="displayEntityRegistrationForm"
                    >
                        <PlusSign />
                    </BaseButton>
                </form>

                <div class="vendor-selection-for-all-other-expenses-container" v-if="vendorSelectionModal">
                    <BaseCheckbox
                        inputContainerClass="vendor-selection-for-all-other-expenses-checkbox-container"
                        labelText="Select this vendor for all other expenses"
                        labelClass="vendor-selection-for-all-other-expenses-checkbox-label"
                        id="vendor-selection-for-all-other-expenses"
                        @change="handleSelectVendorForAllExpensesCheckbox"
                        v-model="checked"
                    />
                </div>
            </b-col>

            <transition name="fade">
                <b-col cols="12" class="selected-entity mt-3 mb-3" v-if="conditionForTopEntitySectionToNotShow">
                    <div class="selected-entity__header d-flex mb-4">
                        <img class="selected-entity__icon" src="@/assets/img/down-arrow.svg" alt="downward arrow" />
                        <span class="selected-entity__heading">
                            {{ topEntitySectionHeading }} ({{ numberOfTopEntitySectionItems }})
                        </span>
                        <span class="selected-entity__line ml-4"></span>
                    </div>
                    <div class="selected-entity__items-container d-flex">
                        <PictureSelect
                            pictureWrapperClass="selected-entity__items"
                            isActiveProperty="isActive"
                            :pictureSelectOptions="topEntityPictureSelectOptions"
                            :removeMultipleItems="removeMultipleItems"
                            :imageProperty="topEntityImageProperty"
                            textDisplayClass="selected-entity-text"
                            :nameProperty="topEntityNameProperty"
                            :altProperty="topEntityNameProperty"
                            @picture-selected="handleSelectedEntity"
                            @picture-removed="handlePictureRemoval"
                        />
                    </div>
                </b-col>
            </transition>

            <b-col cols="12" class="all-entity-items mt-2">
                <div class="all-entity-items__header d-flex mb-4">
                    <img class="all-entity-items__icon" src="@/assets/img/down-arrow.svg" alt="downward arrow" />
                    <span class="all-entity-items__heading">
                        {{ bottomEntitySectionHeading }} ({{ numberOfBottomEntitySectionItems }})</span
                    >
                    <span class="all-entity-items__line ml-4"></span>
                </div>
                <div class="all-entity-items__items-container d-flex">
                    <PictureSelect
                        pictureWrapperClass="all-entity-items__items"
                        isActiveProperty="isActive"
                        :pictureSelectOptions="bottomEntityPictureSelectOptions"
                        :imageProperty="bottomEntityImageProperty"
                        textDisplayClass="all-entity-items-text"
                        :nameProperty="bottomEntityNameProperty"
                        :altProperty="bottomEntityNameProperty"
                        @picture-selected="handleSelectedEntity"
                    />
                </div>
            </b-col>
            <b-col cols="12" class="overflow-auto mb-5">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="2"
                    size="lg"
                    class="select-entity__pagination mt-5"
                    align="center"
                >
                </b-pagination>
            </b-col>
            <b-col cols="12" class="d-flex justify-content-center mt-5 mb-5" v-if="buttonShouldShow">
                <BaseButton
                    className="products-selection-btn"
                    :buttonText="buttonText || 'Done'"
                    @button-clicked="handleButtonClick"
                    :disabled="conditionForButtonToBeDisabled"
                />
            </b-col>
        </b-row>

        <NewCustomerRegistration />
        <NewProductRegistration />
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import PictureSelect from '@/components/ui/PictureSelect.vue';
import PlusSign from '@/components/ui/PlusSign.vue';
import InvoiceHeader from '@/pages/Invoice/InvoiceHeader.vue';
import NewCustomerRegistration from '@/pages/Invoice/AddCustomerFormModal.vue';
import NewProductRegistration from '@/pages/Invoice/AddProductFormModal.vue';

import { PictureSelectOptions } from '@/types';

@Component({
    components: {
        PictureSelect,
        PlusSign,
        InvoiceHeader,
        NewCustomerRegistration,
        NewProductRegistration,
    },
})
export default class DualEntitySection extends Vue {
    private currentPage = 1;
    private totalRows = 16;
    private checked = false;

    @Prop({ default: false }) readonly selectCustomerSection!: boolean;
    @Prop({ default: '' }) readonly invoiceHeaderText!: string;
    @Prop({ default: () => ({}) }) readonly customerName!: object;
    @Prop() readonly dualEntityHeaderPresent!: boolean;
    @Prop() readonly conditionForDualEntitySectionToNotShow!: boolean;
    @Prop() readonly noEntityMainHeading!: string;
    @Prop() readonly noEntitySubHeading!: string;
    @Prop() readonly noEntityButtonText!: string;
    @Prop() readonly entitySearchPlaceholder!: string;
    @Prop() readonly entitySearchIcon!: HTMLImageElement;
    @Prop() readonly entitySearchAddText!: string;
    @Prop() readonly conditionForBottomEntitySectionToNotShow!: boolean;
    @Prop() readonly conditionForTopEntitySectionToNotShow!: boolean;
    @Prop() readonly topEntitySectionHeading!: string;
    @Prop() readonly topEntityImageProperty!: string;
    @Prop({ default: 'name' }) readonly topEntityNameProperty!: string;
    @Prop() readonly numberOfTopEntitySectionItems!: number;
    @Prop() readonly topEntityPictureSelectOptions!: Array<PictureSelectOptions>;
    @Prop() readonly bottomEntitySectionHeading!: string;
    @Prop() readonly bottomEntityImageProperty!: string;
    @Prop({ default: 'name' }) readonly bottomEntityNameProperty!: string;
    @Prop() readonly numberOfBottomEntitySectionItems!: number;
    @Prop({ default: false }) readonly removeMultipleItems!: boolean;
    @Prop({ default: Array<PictureSelectOptions>() }) readonly bottomEntityPictureSelectOptions!: Array<
        PictureSelectOptions
    >;
    @Prop({ default: true }) readonly buttonShouldShow!: boolean;
    @Prop({ default: true }) readonly conditionForButtonToBeDisabled!: boolean;
    @Prop({ default: '' }) readonly buttonText!: string;
    @Prop({ default: false }) readonly vendorSelectionModal!: boolean;
    @Prop({ default: '' }) readonly entityName!: string;

    public handleSelectedEntity(selectedEntity: object, selectedIndex: number) {
        this.$emit('picture-selected', selectedEntity, selectedIndex);
    }

    public handlePictureRemoval(index: number) {
        this.$emit('picture-removed', index);
    }

    public handleButtonClick() {
        this.$emit('button-clicked');
    }

    public handleNameChange() {
        this.$emit('change-name-link-clicked');
    }

    public handleSelectVendorForAllExpensesCheckbox(value: string | boolean) {
        this.$emit('select-vendor-for-all-expenses-changed', value);
    }

    public displayEntityRegistrationForm() {
        this.$bvModal.show(`add-${this.entityName}-form-modal`);
    }
}
</script>

<style lang="scss">
@import 'src/styles/main.scss';
@import 'src/styles/components/dual-entity-selection.scss';
</style>
