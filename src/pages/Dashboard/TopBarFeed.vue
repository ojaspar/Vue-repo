<template>
    <div class="topbar">
        <div class="welcome">
            <h2 class="welcome__header">Hi, {{ fullName }}</h2>
            <span class="welcome__text">Ready for today's business? Check your customers</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { User } from '@/types';

@Component
export default class TopBarFeed extends Vue {
    @Prop({ default: () => ({}) }) readonly authenticatedUser!: User;

    get fullName(): string {
        const { firstName, lastName } = this.authenticatedUser;
        return `${firstName} ${lastName}`;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/dashboard/top-bar-feed';
</style>
