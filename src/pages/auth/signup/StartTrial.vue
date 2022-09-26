<template>
    <b-container fluid class="start-trial">
        <b-row>
            <b-col>
                <div class="start-trial__container">
                    <img src="@/assets/img/mzuri-logo.svg" class="start-trial__logo" />

                    <ProgressTracker v-if="!$root.isMobileScreenSize" />

                    <div class="start-trial__medium-plus-container">
                        <img src="@/assets/img/party-pooper.svg" class="start-trial__party-pooper-image" />
                        <div class="start-trial__heading-container">
                            <h1 class="start-trial__heading-primary">Congratulations Tobi</h1>
                            <p class="start-trial__heading-secondary">
                                Your account as been set up successfully. Kindly activate your 30 days free trail
                            </p>
                        </div>
                        <BasePrimaryButton
                            buttonText="Start Trial"
                            :overRideButtonClass="true"
                            className="start-trial__button"
                        />
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ProgressTracker from '@/components/ui/ProgressTracker.vue';

@Component({
    components: {
        ProgressTracker,
    },
})
export default class StartTrial extends Vue {}
</script>

<style lang="scss">
@import 'src/styles/pages/auth/start-trial.scss';
</style>
