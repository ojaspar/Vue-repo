<template>
    <b-container fluid class="p-0 shareholders-list__wrapper">
        <!--Shareholder Search-->
        <b-row class="shareholders-list__top-section" tabindex="-1" ref="shareholderList">
            <div class="shareholders-list__top-section--left">
                <BaseInputField
                    placeholder="Enter Capital Contributor"
                    inputContainerClass="shareholders-list__search"
                    className="shareholders-list__search--input"
                    v-model="searchString"
                    @focus="showShareholders"
                    @blur="hideShareholders"
                />
            </div>

            <div class="shareholders-list__top-section--right">
                <span class="shareholders-list__search--icon-container">
                    <font-awesome-icon icon="search" class="shareholders-list__search--icon" />
                </span>
                <span class="shareholders-list__add-shareholder-btn" @click="showAddShareholderModal">Add New</span>
            </div>
        </b-row>

        <!--Shareholder List-->
        <b-row
            class="shareholders-list__shareholders--container"
            v-if="showShareholdersList"
            @mousedown="preventBlurFromHappening"
        >
            <div v-if="shareholdersAreAvailable" cols="12" class="shareholders-list__shareholders">
                <AvatarAndResource
                    v-for="(shareholder, index) in shareholdersToBeDisplayed"
                    :key="index"
                    :resourceName="shareholder.shareHoldername"
                    :showChevronIcon="false"
                    :itemKey="shareholder.shareHolderKey"
                    expandedItemKey=""
                    @resource-selected="handleShareholderSelection(shareholder)"
                >
                    <template>
                        <span v-if="shareholder.lastInteractionDate">
                            Donated {{ shareholder.lastInteractionDate | monthDateYearFormat }}
                        </span>
                    </template>
                </AvatarAndResource>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="shareholders-list__shareholders--loader">
                <Loader size="3" />
            </div>

            <div v-show="contentIsEmpty" cols="12" class="shareholders-list__shareholders--empty">
                <span v-html="noContentMessage"></span>
            </div>
        </b-row>

        <ErrorMessage :message="inputFieldError" />

        <!--Add New Shareholder-->
        <BaseModal :modalId="modalId" :modalTitle="modalTitle" @hide-modal="hideAddShareholderModal">
            <AddEditShareholder
                :searchedShareholderName="searchString"
                :shareholderIsBeingEdited="false"
                :shareholderToBeEdited="preselectedShareholder"
                @new-shareholder-added="handleNewShareholderCreation"
            />
        </BaseModal>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import { Status } from '@/types';
import { defaultShareholder, Shareholder } from '@/pages/Financing/Capital/types';

import AddEditShareholder from '@/pages/Financing/Capital/AddEditShareholder.vue';

import UtilityMixins from '@/mixins/Utility';

@Component({
    components: {
        AddEditShareholder,
    },
})
export default class ShareholderListAndSearch extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly shareholders!: Shareholder[];
    @Prop({ default: Status.NORMAL }) readonly requestStatus!: Status;
    @Prop({ default: false }) readonly resetFormInput!: boolean;
    @Prop({ default: () => ({ ...defaultShareholder }) }) readonly preselectedShareholder!: Shareholder;
    @Prop({ default: '' }) readonly inputFieldError!: string;

    private searchString = '';
    private modalId = 'add-or-edit-shareholder-modal';
    private modalTitle = 'New Capital Contribution';
    private showShareholdersList = false;

    public $refs!: {
        shareholderList: HTMLFormElement;
    };

    get requestIsLoading() {
        return this.requestStatus === Status.LOADING;
    }

    get searchStringIsEmpty(): boolean {
        return this.searchString === '';
    }

    get contentIsEmpty() {
        return !this.requestIsLoading && this.noContentMessage != '';
    }

    get searchMatchFound(): boolean {
        if (this.searchString.length == 0) return true;
        if (this.searchString.length > 0 && this.shareholders.length < 1) return true;

        if (!this.shareholdersToBeDisplayed) return false;

        return this.shareholdersToBeDisplayed.length > 0;
    }

    get shareholdersAreAvailable(): boolean {
        if (!this.shareholders) return false;

        return this.shareholders.length > 0;
    }

    get shareholdersToBeDisplayed(): Shareholder[] {
        if (this.searchStringIsEmpty) return this.shareholders;

        return this.shareholders.filter(shareholder =>
            shareholder.shareHoldername.toLowerCase().match(this.searchString.toLowerCase()),
        );
    }

    get noContentMessage() {
        if (!this.searchMatchFound) {
            return `<p>No match found</p>`;
        }
        if (!this.shareholdersAreAvailable) {
            return `<p>Looks like you haven't added any capital contributor.</p>
                        <p>Click the 'Add New' link above to add a capital contributor</p>`;
        }
        return '';
    }

    @Watch('resetFormInput')
    resetFormInputValue(resetFormInput: boolean) {
        if (resetFormInput) {
            this.searchString = '';
        }
    }

    @Watch('preselectedShareholder.name')
    setFormValue(shareHoldername: string) {
        this.searchString = shareHoldername;
    }

    private showAddShareholderModal() {
        this.$bvModal.show(this.modalId);
    }

    private hideAddShareholderModal() {
        this.$bvModal.hide(this.modalId);
    }

    private handleNewShareholderCreation(shareholder: Shareholder) {
        this.$emit('create-shareholder', shareholder);
        //stop gap till the key is returned from the add shareholder endpoint...
        window.location.reload();

        // uncomment this when you remove the window.location.reload...
        // this.handleShareholderSelection(shareholder);
        // this.dismissModal();
    }

    private dismissModal() {
        setTimeout(() => {
            this.hideAddShareholderModal();
        }, 1000);
    }

    private showShareholders() {
        this.showShareholdersList = true;
    }

    private hideShareholders() {
        this.showShareholdersList = false;
        //this.searchString = '';
    }

    private handleShareholderSelection(shareholder: Shareholder) {
        this.$emit('shareholder-selected', shareholder);
        this.searchString = shareholder.shareHoldername;
        this.$refs.shareholderList.focus();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/shareholders-list';
</style>
