<template>
    <div class="list-search__search">
        <b-col class="list-search__search--left">
            <font-awesome-icon icon="search" class="search-icon" />
            <BaseInputField :placeholder="placeholder" class="search-input" @input="handleSearchInputChange" />
        </b-col>
        <b-col class="list-search__search--right txt--primary pointer" @click="$emit('add-new-resource')">
            <div class="list-search__add-new-button">
                <PlusSign class="mr-1" /><span class="list-search__add-new-button--text"> {{ buttonText }}</span>
            </div>
        </b-col>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ListSearchAndAddBar extends Vue {
    @Prop({ required: true }) buttonText!: string;
    @Prop({ default: 'Search' }) placeholder!: string;

    private handleSearchInputChange(searchString: string) {
        this.$emit('search-input-changed', searchString);
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/list-search-and-add-bar';
</style>
