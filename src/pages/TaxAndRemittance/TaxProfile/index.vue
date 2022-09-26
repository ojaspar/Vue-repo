<template>
    <b-container fluid class="tax-profile-page">
        <div class="tax-page-container">
            <BusinessTaxBio />
            <BusinessTaxProfiles />
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import BusinessTaxBio from '@/pages/TaxAndRemittance/TaxProfile/BusinessTaxBio.vue';
import BusinessTaxProfiles from '@/pages/TaxAndRemittance/TaxProfile/BusinessTaxProfiles.vue';

@Component({
    components: {
        BusinessTaxBio,
        BusinessTaxProfiles,
    },
})
export default class TaxProfileSetup extends Vue {
    private pageTitle = 'Tax Setup';

    created() {
        this.$parent.$emit('update-page-title', this.pageTitle);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/tax/tax-page';
</style>
