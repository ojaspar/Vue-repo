<template>
    <div>
        <div class="modal" v-if="edit">
            <div class="modal-modal-content animate-top card-4">
                <header class="modal-header">
                    <div class="modal-head-layout">
                        <h3 class="white">Edit Profile Details</h3>
                    </div>
                    <div class="pointer" @click="close()">
                        <i class="fas fa-times white "></i>
                    </div>
                </header>
                <section class="modal-section">
                    <div class="modal-field">
                        <input class="modal-input" type="text" placeholder="firstname" id="firstname" />
                        <label class="modal-label" for="firstname">FirstName</label>
                    </div>
                    <div class="modal-field">
                        <input class="modal-input" type="text" placeholder="lastame" id="lastName" />
                        <label for="lastName" class="modal-label">LastName</label>
                    </div>
                    <div class="modal-field">
                        <input class="modal-input" type="text" placeholder="email" id="Email" />
                        <label for="Email" class="modal-label">Email</label>
                    </div>
                    <div class="modal-field">
                        <input class="modal-input" type="text" placeholder="phone" id="phone" />
                        <label for="phone" class="modal-label">Phone</label>
                    </div>
                    <div class="modal-bnt-layout">
                        <button class="modal-button">Save</button>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class AppEdit extends Vue {
    @Prop({ default: false }) readonly display!: boolean;

    @Prop({ default: false }) readonly edit!: boolean;

    private modalData = this.display;

    @Watch('display')
    displayValueHasChanged(val: boolean) {
        val ? (this.modalData = val) : (this.modalData = false);
    }

    public close() {
        this.modalData = false;
    }
}
</script>

<style></style>
