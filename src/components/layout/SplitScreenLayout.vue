<template>
    <div class="authentication">
        <header class="auth-header">
            <div class="auth-header__logo-container">
                <MzuriLogo className="auth-header__logo" />
            </div>
        </header>
        <main>
            <section class="company">
                <div class="container-fluid ht-100p m-0 p-0">
                    <div class="d-flex flex-row justify-content-center">
                        <div class="col-6 col-lg-6 white-screen">
                            <slot name="white-screen"></slot>
                        </div>

                        <div class="default-slot">
                            <slot></slot>
                        </div>

                        <div class="col-6 col-lg-6 background-screen">
                            <slot name="background-screen"></slot>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped>
@import 'src/styles/layout/splitscreen/header';
@import 'src/styles/layout/splitscreen/split-screen-layout';
</style>
