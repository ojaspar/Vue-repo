<template>
    <span></span>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class DeleteModal extends Vue {
    @Prop({ required: true }) readonly index!: number;
    @Prop({ default: '' }) readonly confirmationMessage!: string;
    @Prop({ default: 'Remove Item' }) readonly modalTitle!: string;

    private defaultMessage = `Are you sure you want to remove this item?`;

    private showModal() {
        this.$bvModal
            .msgBoxConfirm(this.confirmationMessage || this.defaultMessage, {
                title: this.modalTitle,
                size: 'md',
                buttonSize: 'lg',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                cancelVariant: 'light',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true,
            })
            .then((decision: boolean) => {
                if (decision) this.$emit('delete-action-confirmed', this.index);
                else this.$emit('modal-hidden');
            })
            .catch(err => err);
    }

    mounted() {
        this.showModal();
    }
}
</script>
