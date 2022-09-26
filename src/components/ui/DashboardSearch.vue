<template>
    <b-row class="search-create justify-content-end align-items-center">
        <SearchBar class="mr-5 search-create__input" />
        <BaseButton
            @button-clicked="handleRouteToPage"
            :buttonText="buttonText"
            class="ml-5 d-flex align-items-center justify-content-between"
        >
            <PlusSign />
        </BaseButton>
    </b-row>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

import PlusSign from '@/components/ui/PlusSign.vue';
import SearchBar from '@/components/ui/SearchBar.vue';

@Component({
    components: {
        PlusSign,
        SearchBar,
    },
})
export default class DashboardSearch extends Vue {
    @Prop({ required: true, default: '' }) readonly routeName!: string;
    @Prop({ required: true, default: '' }) readonly buttonText!: string;

    private handleRouteToPage(routeName: string): void {
        this.$router.push({ name: routeName });
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/dashboard-search';
</style>
