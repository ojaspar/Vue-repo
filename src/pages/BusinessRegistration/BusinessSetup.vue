<template>
    <div class="business-setup ht-100p">
        <div class="container-fluid ht-100p m-0 p-0 d-flex">
            <div class="col-lg-7 col-md-10 business-form-container">
                <div class="ht-100p d-flex flex-row justify-content-center">
                    <form class="d-flex flex-column align-items-center business-form position-relative">
                        <Error :message="error" v-if="status === 'ERROR'" />
                        <div class="d-flex heading mb-3 container-fluid align-items-center">
                            <div class="d-flex flex-column m-auto">
                                <p class="business-form__title mb-1">What type of business do you do?</p>
                                <ProgressBar :progress="progress" />
                            </div>
                        </div>

                        <div class="form-input mt-5">
                            <PictureSelect
                                pictureWrapperClass="business"
                                isActiveProperty="isActive"
                                :pictureSelectOptions="businessVerticals"
                                optionKeyProperty="businessVerticalKey"
                                @picture-selected="handleSelect"
                                imageProperty="imageUrl"
                                textDisplayClass="business__category"
                                nameProperty="name"
                                altProperty="name"
                            />
                            <Loader v-if="status === 'LOADING'" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import PictureSelect from '@/components/ui/PictureSelect.vue';

import { BusinessVertical, Status } from '@/types';

@Component({
    components: {
        PictureSelect,
    },
})
export default class BusinessSetup extends Vue {
    @Prop({ required: true }) readonly businessVerticals!: Array<BusinessVertical>;
    @Prop({ required: true }) readonly progress!: number;
    @Prop({ default: Status.NORMAL }) readonly status!: Status;
    @Prop({ default: '' }) readonly error!: string;

    public handleSelect(value: BusinessVertical) {
        this.$emit('business-selected', { businessType: value.businessVerticalKey });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/business-registration.scss';
</style>
