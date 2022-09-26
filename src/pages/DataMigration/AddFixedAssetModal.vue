<template>
    <b-modal :id="id" :no-close-on-backdrop="closeBackdropOnModal" class="add-entity-modal" @hide="hideFixedAssetModal">
        <template v-slot:modal-header="{ cancel }">
            <div class="add-entity-modal__header">
                <h1 class="add-entity-modal__header-text">New Fixed Asset</h1>
                <span class="add-entity-modal__cancel-btn" title="Cancel" @click="cancel()"> &times; </span>
            </div>
        </template>
        <BaseSelectWithBorderAndFloatingLabel
            v-model="asset.assetTypeKey"
            floatingLabelText="Asset Type"
            defaultOptionText="-- Select Asset Type --"
            :options="businessAssetTypes"
            textProperty="name"
            valueProperty="key"
            keyProperty="key"
            :errors="errors.assetTypeKey"
            :emitEventObject="true"
            errorLabelClass="setup__modal-error-label-text"
            @input="handleFixedAssetTypeSelection"
        />
        <BaseInputFieldWithBorderAndFloatingLabel
            floatingLabelText="Asset Name"
            v-model="asset.assetName"
            :errors="errors.name"
            @input="validateFixedAssetName"
            errorLabelClass="setup__modal-error-label-text"
        />
        <BaseTextAreaWithBorderAndFloatingLabel
            floatingLabelText="Description"
            v-model="asset.description"
            :errors="errors.description"
            errorLabelClass="setup__modal-error-label-text"
            @input="validateFixedAssetDescription"
        />
        <BaseSelectWithBorderAndFloatingLabel
            v-model="asset.currentValue.currencyKey"
            floatingLabelText="Currency"
            defaultOptionText="-- Select Currency --"
            name="currencyName"
            :options="getCurrencyObjectArrayFromListOfCurrency(currencyKeyList)"
            keyProperty="currencyKey"
            valueProperty="currencyKey"
            textProperty="currencyName"
            :isCurrency="true"
            @input="handleCurrencyChange"
            :errors="errors.currency"
            errorLabelClass="setup__modal-error-label-text"
        />
        <BaseInputFieldWithBorderAndFloatingLabel
            :floatingLabelText="labelCurrencyText"
            :value="convertFigureToCurrency(asset.currentValue.amount)"
            :errors="errors.currentValue"
            errorLabelClass="setup__modal-error-label-text"
            @input="formatAndValidateFixedAssetCurrentValue"
        />
        <BaseInputFieldWithBorderAndFloatingLabel
            type="number"
            floatingLabelText="Estimated Remaining Lifespan (Months)"
            v-model="asset.usefulMonthLife"
            :errors="errors.usefulMonthLife"
            errorLabelClass="setup__modal-error-label-text"
            @input="validateUsefulMonthLife"
        />
        <div class="setup__modal-buttons-container">
            <BaseButton
                buttonText="Delete"
                className="setup__delete-button"
                :overRideButtonClass="true"
                v-if="isEditing"
                @button-clicked="handleDeletionOfFixedAsset(indexOfAssetObjectToBeEdited)"
            />
            <BasePrimaryButton
                buttonText="Save"
                className="setup__save-button"
                @button-clicked="handleAdditionOfFixedAsset"
                :disabled="atLeastOneErrorExists(errors)"
            />
        </div>
        <template v-slot:modal-footer>
            <div></div>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import BusinessModule from '@/store/modules/business';

import ValidationMixin from '@/mixins/validation';
import CurrencyMixin from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';

import { Asset, AssetTypeData, CurrencyKeyListData } from '@/pages/DataMigration/types';
import { Status, TargetObject } from '@/types';

const business = namespace('business');
let businessModule: BusinessModule;

@Component
export default class AddFixedAssetModal extends Mixins(ValidationMixin, UtilityMixins, CurrencyMixin) {
    @Prop({ required: true }) readonly id!: string;
    @Prop({ required: true }) readonly assetToBeEdited!: Asset;
    @Prop({ default: false }) readonly isEditing!: boolean;
    @Prop({ default: 0 }) readonly indexOfAssetObjectToBeEdited!: number;

    @business.State
    public businessRequestStatus!: Status;

    @business.State
    public currencyKeyList!: Array<CurrencyKeyListData>;

    @business.State
    public businessAssetTypes!: Array<AssetTypeData>;

    @business.Action
    public getPaymentCurrencyKeyList!: () => void;

    @business.Action
    public getBusinessAssetTypes!: () => void;

    public errors = {
        name: '',
        description: '',
        assetTypeKey: '',
        currentValue: '',
        usefulMonthLife: '',
        currency: '',
    };

    get modalTitle(): string {
        return (this.isEditing ? 'Edit' : 'Add') + ' Fixed Asset';
    }

    private unformattedAssetCurrentValue = '';
    private currentValueStr = '';
    private closeBackdropOnModal = false;

    private initialStateOfAsset: Asset = {
        assetName: '',
        description: '',
        assetTypeKey: '',
        assetTypeText: '',
        currentValue: {
            currencyKey: this.homeCurrencyKey,
            amount: '',
        },
        usefulMonthLife: '',
    };

    private asset = { ...this.initialStateOfAsset };

    get labelCurrencyText() {
        return `Current Value ${this.conditionForSelectingACurrencyInParenthesis}`;
    }

    public handleFixedAssetTypeSelection(e: TargetObject) {
        this.asset.assetTypeKey = e.target.value;
        this.asset.assetTypeText = e.target.options[e.target.selectedIndex].text;
        this.validateFixedAssetType();
    }

    public validateFixedAssetName() {
        this.validateEmptyField('name', this.asset.assetName, this.errors, 'Please enter a name');
    }

    public validateFixedAssetDescription() {
        this.validateEmptyField('description', this.asset.description, this.errors, 'Please enter a description');
    }

    public validateFixedAssetType() {
        this.validateEmptyField('assetTypeKey', this.asset.assetTypeKey, this.errors, 'Please select an asset type');
    }

    public validateFixedAssetCurrentValue() {
        this.validateEmptyField('currentValue', this.currentValueStr, this.errors, 'Please enter an amount');
    }

    public validateUsefulMonthLife() {
        this.validateEmptyField(
            'usefulMonthLife',
            this.asset.usefulMonthLife.toString(),
            this.errors,
            'Please enter the remaining useful lifespan in months',
        );
    }

    public validateFixedAssetModal() {
        this.validateFixedAssetName();
        this.validateFixedAssetDescription();
        this.validateFixedAssetType();
        this.validateCurrency();
        this.validateFixedAssetCurrentValue();
        this.validateUsefulMonthLife();
    }

    public formatAndValidateFixedAssetCurrentValue(currentValue: number) {
        const inputToNumber = this.convertFormattedFiguresToNumber(currentValue.toString());

        if (isNaN(inputToNumber)) {
            this.errors.currentValue = 'Please a valid Number';
        } else {
            this.asset = Object.assign({}, this.asset, {
                ...this.asset,
                currentValue: {
                    currencyKey: Number(this.selectedCurrencyObject.currencyKey),
                    amount: inputToNumber,
                },
            });
            this.currentValueStr = this.validateTextFieldUsedForAFormattedNumber(currentValue, inputToNumber);

            this.$nextTick(() => {
                this.validateFixedAssetCurrentValue();
            });
        }
    }

    public handleDeletionOfFixedAsset(indexOfAssetObjectToBeEdited: number) {
        this.$emit('delete-asset-from-list', indexOfAssetObjectToBeEdited);
    }

    public handleAdditionOfFixedAsset() {
        const payload = {
            ...this.asset,
        };

        this.validateFixedAssetModal();

        if (!this.atLeastOneErrorExists(this.errors)) {
            if (this.isEditing) {
                this.$emit('edited-fixed-asset', {
                    ...payload,
                    currentValue: {
                        ...payload.currentValue,
                        currencyKey: Number(payload.currentValue.currencyKey),
                    },
                });
            } else {
                this.$emit('added-fixed-asset', {
                    ...payload,
                    currentValue: {
                        ...payload.currentValue,
                        currencyKey: Number(payload.currentValue.currencyKey),
                    },
                    usefulMonthLife: Number(payload.usefulMonthLife),
                });
            }
        }
    }

    public clearFixedAssetModal() {
        this.asset = { ...this.initialStateOfAsset };
        this.selectedCurrencyObject = this.getCurrencyObjectFromCurrencyKey(this.homeCurrencyKey.toString());
        this.asset.currentValue.currencyKey = this.homeCurrencyKey;
    }

    public hideFixedAssetModal() {
        this.$emit('hide-add-asset-modal');
    }

    created() {
        businessModule = getModule(BusinessModule, this.$store);
        businessModule.getBusinessAssetTypes();
    }

    mounted() {
        this.$bvModal.show(this.id);

        if (this.isEditing) {
            this.asset = { ...this.assetToBeEdited };
            // set currentValueStr to currentValue amount when loading the modal for editing
            // and turn it to a string for easier validation (negation of an empty string is falsy in JS)
            this.currentValueStr = this.asset.currentValue.amount.toString();
            this.selectedCurrencyObject = this.getCurrencyObjectFromCurrencyKey(
                this.asset.currentValue.currencyKey.toString(),
            );
        } else {
            // clear the modal every time the add fixed asset button is clicked
            this.clearFixedAssetModal();
        }
    }

    public hideFixedAssetsModal() {
        this.$emit('hide-add-debtor-modal');
    }

    @Watch('asset', { deep: true, immediate: true })
    assetValueHasChanged() {
        this.closeBackdropOnModal = this.areAnyFieldsInFormFilled(this.asset);
    }
}
</script>

<style lang="scss">
@include data-migration-add-entity-modal;
</style>
