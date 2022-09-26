<template>
    <LoginForm :status="status" />
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

import LoginForm from '@/pages/Login/LoginForm.vue';

export default Vue.extend({
    components: {
        LoginForm,
    },
    computed: {
        ...mapState('auth', ['status']),
    },
});
</script>
