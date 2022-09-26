<template>
    <nav class="search d-flex align-items-center" :class="className">
        <img src="@/assets/img/search.svg" alt="notification icon" class="search__icon" />
        <BaseInputField
            type="search"
            placeholder="Search"
            className="search-input__field"
            inputContainerClass="search-input"
        />
    </nav>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class SearchBar extends Vue {
    @Prop({ default: '' }) readonly className!: string;
}
</script>

<style lang="scss">
@import 'src/styles/components/search-bar';
</style>
