import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
class OTPMixin extends Vue {
    public focusIndex = 1;

    get conditionsForOTPButtonToBeDisabled() {
        return Object.values(this.form).some(otpInput => !otpInput.length);
    }

    public form = {
        inputOne: '',
        inputTwo: '',
        inputThree: '',
        inputFour: '',
    };

    public handleOTPDeletion() {
        if (this.focusIndex > 1) {
            this.focusIndex -= 1;
        }
    }

    public handleOTPInput(value: string) {
        this.$nextTick(() => {
            // after the focus index from the input field watch below is updated, increase the focusIndex value
            if (value.length === 1 && this.focusIndex < 4) {
                this.focusIndex += 1;
            }
        });
    }

    public handleButtonClick() {
        // const otpValue = Object.values(this.form).join('');
        // run api for verifying otp
        this.$emit('password-change-is-successful');
    }

    @Watch('form.inputOne')
    formInputOneHasChanged() {
        // set focus index of first otp input field to 1 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 1;
    }

    @Watch('form.inputTwo')
    formInputTwoHasChanged() {
        // set focus index of first otp input field to 2 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 2;
    }

    @Watch('form.inputThree')
    formInputThreeHasChanged() {
        // set focus index of first otp input field to 3 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 3;
    }

    @Watch('form.inputFour')
    formInputFourHasChanged(newValue: string) {
        // set focus index of first otp input field to 4 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 4;
        this.$nextTick(() => {
            this.form.inputFour = newValue.slice(0, 1); // this ensures that the fourth input field has one value
            // it is an equivalent of max length for input type number. inputs 1-3 don't have to be sliced because the
            // cursor changes when 1 number is inputted in the input field
        });
    }
}

export default OTPMixin;
