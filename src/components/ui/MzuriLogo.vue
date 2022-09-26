<template>
    <div @click="logoRedirect" :class="className">
        <img src="@/assets/img/mzuri-logo.svg" alt="Mzuri Logo" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import SessionStorageService from '@/services/sessionStorage';

@Component
export default class MzuriLogo extends Vue {
    @Prop({ default: '' }) readonly className!: string;

    private logoRedirect() {
        const userObject: object = SessionStorageService.decodeToken();

        if (!userObject) {
            return (window.location.href = 'https://www.mzuri.ng');
        }

        if (this.$route.name !== 'Dashboard') return this.$router.push({ name: 'Dashboard' });

        return;
    }
}
</script>

<style lang="scss" scoped>
img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    -o-object-fit: contain;
    -o-object-position: center;
}
</style>
