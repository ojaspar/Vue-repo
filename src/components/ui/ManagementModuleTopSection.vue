<template>
    <div>
        <b-row class="top-section">
            <div class="top-section__search">
                <b-col class="top-section__search--container">
                    <font-awesome-icon icon="search" class="top-section__search--icon" />
                    <BaseInputField
                        placeholder="Search"
                        class="search-input"
                        :value="searchStringValue"
                        @input="handleSearchInput"
                    />
                </b-col>
                <b-col class="top-section__add-module-entity-btn-mobile" @click="$emit('add-new-module-entity')">
                    <PlusSign class="mr-1 pointer" />
                    <span class="top-section__add-module-entity-btn-mobile--text">
                        Add New
                    </span>
                </b-col>
            </div>

            <div class="top-section__add-module-entity-btn">
                <BaseButton
                    :overRideButtonClass="true"
                    className="add-module-entity-btn"
                    :buttonText="buttonText"
                    @button-clicked="$emit('add-new-module-entity')"
                />
            </div>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import PlusSign from '@/components/ui/PlusSign.vue';

@Component({
    components: {
        PlusSign,
    },
})
export default class ManagementModuleTopSection extends Vue {
    @Prop({ default: '' }) readonly searchStringValue!: string;
    @Prop({ default: '' }) readonly buttonText!: string;

    private handleSearchInput(searchStringInput: string) {
        this.$emit('search-string-changed', searchStringInput);
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/management-module-top-section.scss';
</style>
