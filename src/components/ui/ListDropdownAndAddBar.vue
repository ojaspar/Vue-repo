<template>
    <div class="list-dropdown-and-add-bar__top-section" ref="entityList">
        <div class="list-dropdown-and-add-bar__top-section--left">
            <BaseInputField
                :placeholder="placeholder"
                inputContainerClass="list-dropdown-and-add-bar__search"
                className="list-dropdown-and-add-bar__search--input"
                :autoFocus="autoFocus"
                v-model="searchString"
                @input="emitSearchStringValue"
                @focus="showEntity"
                @blur="handleBlurEvent"
            />
        </div>
        <div class="list-dropdown-and-add-bar__top-section--right">
            <span class="list-dropdown-and-add-bar__search--icon-container">
                <font-awesome-icon icon="search" class="list-dropdown-and-add-bar__search--icon" />
            </span>
            <span
                class="list-dropdown-and-add-bar__add-entity-btn"
                @mousedown="preventBlurFromHappening"
                @click.stop="$emit('add-entity-button-clicked')"
            >
                {{ addEntityText }}
            </span>
        </div>

        <div
            class="list-dropdown-and-add-bar__entity--container"
            v-if="showEntityList"
            @mousedown="preventBlurFromHappening"
        >
            <div v-if="entityIsAvailable" cols="12" class="list-dropdown-and-add-bar__entity">
                <AvatarAndResource
                    v-for="(entity, index) in entityToBeDisplayed"
                    :key="index"
                    :resourceName="entity[entityNameKey]"
                    :showChevronIcon="false"
                    :itemKey="entity[entityKey]"
                    expandedItemKey=""
                    @resource-selected="handleEntitySelection(entity)"
                >
                    <!-- <template>
                        <span v-if="entity[dateKey]">
                            {{ entityPredateText }} {{ entity[dateKey] | monthDateYearFormat }}
                        </span>
                    </template> -->
                </AvatarAndResource>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="list-dropdown-and-add-bar__entity--loader">
                <Loader size="3" />
            </div>

            <div v-show="contentIsEmpty" cols="12" class="list-dropdown-and-add-bar__entity--empty">
                <span v-html="noContentMessage"></span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import UtilityMixins from '@/mixins/Utility';

@Component
export default class ListDropdownAndAddBar extends Mixins(UtilityMixins) {
    @Prop({ default: '' }) readonly searchInputClass!: string;
    @Prop({ required: true }) readonly addEntityText!: string;
    @Prop({ required: true }) readonly placeholder!: string;
    @Prop({ default: false }) readonly requestIsLoading!: boolean;
    @Prop({ default: '' }) readonly entityKey!: string;
    @Prop({ default: '' }) readonly entityText!: string;
    @Prop({ required: true }) readonly entityList!: any;
    @Prop({ default: '' }) readonly dateKey!: string;
    @Prop({ default: '' }) readonly entityNameKey!: any;
    @Prop({ default: false }) readonly newEntityCreated!: boolean;
    @Prop({ default: () => ({}) }) readonly createdEntity!: any;
    @Prop({ default: false }) readonly clearSearchString!: boolean;
    @Prop({ default: false }) readonly autoFocus!: boolean;

    private searchString = '';

    private showEntityList = false;

    public $refs!: {
        entityList: HTMLFormElement;
    };

    get contentIsEmpty() {
        return !this.requestIsLoading;
    }

    get searchStringIsEmpty(): boolean {
        return this.searchString === '';
    }

    get entityToBeDisplayed() {
        if (this.searchStringIsEmpty) return this.entityList;

        return this.entityList.filter((entity: any) => {
            const values = Object.values(entity);
            return values.find(value => {
                if (typeof value !== 'string') return;
                return value.toLowerCase().includes(this.searchString.toLowerCase());
            });
        });
    }

    get searchMatchFound(): boolean {
        if (this.searchString.length === 0) return true;
        if (this.searchString.length > 0 && this.entityList.length < 1) return true;
        return this.entityToBeDisplayed.length > 0;
    }

    get noContentMessage() {
        if (!this.searchMatchFound) {
            return `<p>No match found</p>`;
        }
        if (!this.entityIsAvailable) {
            return `<p>Looks like you haven't added any ${this.entityText} yet.</p>
                        <p>Click the 'Add ${this.entityText}' link above to get started</p>`;
        }
        return '';
    }

    get entityIsAvailable() {
        return this.entityList.length > 0;
    }

    private showEntity() {
        this.showEntityList = true;
    }

    private hideEntity() {
        this.showEntityList = false;
    }

    private handleEntitySelection(entity: any) {
        this.searchString = entity[this.entityNameKey];
        this.emitSearchStringValue(this.searchString);
        this.$emit('resource-selected', entity);
        this.hideEntity();
        this.$refs.entityList.focus();
    }

    private emitSearchStringValue(searchString: string) {
        this.$emit('search-string-changed', searchString);
    }

    private emitEntityListDismissal() {
        this.$emit('entity-list-hidden');
    }

    private handleBlurEvent() {
        this.hideEntity();
        this.emitEntityListDismissal();
    }

    @Watch('searchString')
    searchStringHasChanged() {
        const listOfEntityNames = this.entityList.map((entity: any) => entity[this.entityNameKey]);
        if (!listOfEntityNames.includes(this.searchString)) {
            this.$emit('invalid-search-string');
            return true;
        }
        this.$emit('valid-search-string');
        return false;
    }

    @Watch('newEntityCreated')
    @Watch('createdEntity', { deep: true })
    handleCreatedEntiy() {
        this.handleEntitySelection(this.createdEntity);
    }

    @Watch('clearSearchString')
    updateSearchString(clearValue: boolean) {
        if (clearValue) this.searchString = '';
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/list-dropdown-and-add-bar';
</style>
