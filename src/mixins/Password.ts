import { Component, Vue } from 'vue-property-decorator';

@Component
class PasswordMixin extends Vue {
    public inputType = 'password';
    public icon = 'eye';
    public showPasswordText = true;

    public togglePasswordIcon(): void {
        if ('password' === this.inputType) {
            this.inputType = 'text';
        } else {
            this.inputType = 'password';
        }

        if (!this.showPasswordText) {
            this.showPasswordText = true;
            this.icon = 'eye';
        } else {
            this.showPasswordText = false;
            this.icon = 'eye-slash';
        }
    }
}

export default PasswordMixin;
