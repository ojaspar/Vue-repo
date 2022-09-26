<template>
    <div id="app">
        <component :is="$route.meta.layout || 'div'" :error="error">
            <transition name="fade" mode="out-in" appear>
                <!--BaseRouterView /-->
                <router-view :key="$route.path" />
            </transition>
        </component>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Status } from '@/types';

const business = namespace('business');
const auth = namespace('auth');

@Component
export default class App extends Vue {
    private status: string = Status.NORMAL;
    private error = '';

    @business.State(state => state.status) businessStatus!: Status;
    @business.State(state => state.error) businessError!: string;
    @auth.State(state => state.status) authStatus!: Status;
    @auth.State(state => state.error) authError!: string;

    @Watch('businessStatus')
    businessStatusChanged() {
        this.status = this.businessStatus;
    }

    @Watch('businessError')
    businessErrorChanged() {
        this.error = this.businessError;
    }

    @Watch('authError')
    authStatusChanged() {
        this.error = this.authError;
    }

    @Watch('authStatus')
    authErrorChanged() {
        this.status = this.authStatus;
    }
}
</script>
