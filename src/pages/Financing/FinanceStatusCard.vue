<template>
    <b-row>
        <b-col cols="12" class="finance-card">
            <div class="d-flex">
                <h3 class="finance-card__text">loans</h3>
                <ProgressBar
                    progress=""
                    containerClass="finance-card__progess"
                    className="finance-card__progess--loan"
                    :overRideDefaultStyle="true"
                />
            </div>
            <div class="d-flex">
                <h3 class="finance-card__text">capital</h3>
                <ProgressBar
                    progress=""
                    containerClass="finance-card__progess"
                    className="finance-card__progess--capital"
                    :overRideDefaultStyle="true"
                />
            </div>
        </b-col>
    </b-row>
</template>

<style lang="scss">
@import 'src/styles/pages/financing/finance-status-card';
</style>
