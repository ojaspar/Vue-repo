<template>
    <div>
        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Amount Payable"
                    :disabled="true"
                    :value="liability.taxPayable | amountWithCurrency"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col sm="12" md="6">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Amount Paying"
                    :value="convertFigureToCurrency(form.amountPaid.amount)"
                    @input="handleAmountInput"
                />
            </b-col>

            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Amount Remaining"
                    :value="amountRemaining | amountWithCurrency"
                    :disabled="true"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseSelectWithBorderAndFloatingLabel
                    floatingLabelText="Paid From"
                    keyProperty="paymentAccountKey"
                    valueProperty="paymentAccountKey"
                    textProperty="displayNameWithBalance"
                    defaultOptionText="-- Select Account --"
                    :options="updatedPaymentAccounts"
                    :value="form.paymentAccountKey"
                    @change="handlePaymentAccountSelection"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseDateFieldWithBorderAndFloatingLabel
                    placeholder="Transaction Date"
                    floatingLabelText="Transaction Date"
                    @change="handleTransactionDateChange"
                    :value="form.transactionDate"
                />
            </b-col>
        </b-row>

        <!-- Adjoining Documents for tax remittance -->

        <!-- <b-row key="form1">
            <b-col>
                <BaseFileInputWithBorderAndFloatingLabel
                    :fileUploadText="taxRemittance.paymentReceipt"
                    :showFileUploadText="showFileUploadText"
                    :emitEventObject="true"
                    :value="form.paymentReceipt"
                    id="form101"
                    @input="processSelectedFile($event, 'paymentReceipt')"
                />
            </b-col>
        </b-row>

        <b-row key="form2">
            <b-col>
                <BaseFileInputWithBorderAndFloatingLabel
                    :fileUploadText="taxRemittance.filingDocument"
                    :emitEventObject="true"
                    id="form102"
                    :value="form.filingDocument"
                    :showFileUploadText="showFileUploadText"
                    @input="processSelectedFile($event, 'filingDocument')"
                />
            </b-col>
        </b-row>

        <b-row key="progress-bar" v-if="currentUpload" class="tax-page-container__progress-bar-container">
            <b-col>
                <ProgressBar :progress="uploadCountAndProgress.progress" class="tax-forms-progress-bar" />
                <p>Uploading {{ uploadCountAndProgress.count }}/3</p>
            </b-col>
        </b-row> -->

        <BlockErrorMessage :message="error" />

        <b-row class="mt-5 mb-5" align-h="center">
            <BasePrimaryButton buttonText="Save" @button-clicked="remitTax" :status="taxRequestStatus.remitTax" />
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import {
    TaxLiability,
    RemitTaxForm,
    TaxRemittanceDocument,
    TaxLiabilityRemittanceForm,
    TaxRemittanceDocuments,
    UploadedTaxRemittanceForms,
    taxLiabilityStub,
} from '@/pages/TaxAndRemittance/types';
import { MoneyObject, PaymentAccount, Status } from '@/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import TaxMixin from '@/pages/TaxAndRemittance/TaxMixin';

import { REMIT_TAX_LIABILITY_ERROR } from '@/store/tax-module-constants';

const expenses = namespace('expense');

@Component
export default class RemitTax extends Mixins(UtilityMixins, CurrencyMixins, TaxMixin) {
    @Prop({ required: true }) readonly liability!: TaxLiability;

    @expenses.State
    private paymentAccounts!: Array<PaymentAccount>;

    private form: RemitTaxForm = { ...taxLiabilityStub, paymentAccountKey: '', transactionDate: '' };

    private taxRemittance: TaxRemittanceDocument = {
        paymentReceipt: 'Upload Payment Receipt',
        filingDocument: 'Upload Filing Document',
    };
    // private formData = new FormData();
    // private requestLoadingStatus: Status = Status.NORMAL;
    // private showFileUploadText = true;

    // private currentUpload: TaxRemittanceDocuments = TaxRemittanceDocuments.empty;

    get amountRemaining(): MoneyObject {
        const { balance } = this.liability;
        const { amount: amountUserIsPaying } = this.form.amountPaid;

        return {
            amount: balance.amount - amountUserIsPaying,
            currencyKey: balance.currencyKey,
        };
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    // get uploadCountAndProgress(): { count: number; progress: number } {
    //     if (!this.currentUpload)
    //         return {
    //             count: 0,
    //             progress: 0,
    //         };

    //     const uploads = {
    //         paymentReceipt: {
    //             count: 1,
    //             progress: 50,
    //         },
    //         filingDocument: {
    //             count: 2,
    //             progress: 100,
    //         },
    //     };

    //     return uploads[this.currentUpload];
    // }

    private handleAmountInput(amountInput: string) {
        const parsedAmount = this.convertFormattedCurrencyToNumber(amountInput);
        this.form.amountPaid.amount = parsedAmount;
    }

    private handlePaymentAccountSelection(paymentAccountKey: string) {
        // we need the payment account key and the payment account currency key
        const paymentAccount = this.updatedPaymentAccounts.find(
            (paymentAccount: PaymentAccount) => paymentAccount.paymentAccountKey === paymentAccountKey,
        );

        if (!paymentAccount) return;

        const { accountBalance } = paymentAccount;
        const { amountPaid } = this.form;

        this.form.paymentAccountKey = paymentAccount.paymentAccountKey;

        if (amountPaid.amount > accountBalance) {
            this.taxModule.context.commit(REMIT_TAX_LIABILITY_ERROR, { message: 'Insufficient Balance!' });
            return;
        }

        this.taxModule.context.commit(REMIT_TAX_LIABILITY_ERROR, { message: '' });
    }

    // private processSelectedFile(event: any, fieldName: keyof TaxRemittanceDocument) {
    //     const file = event.target.files;
    //     const fileName = event.target.value;
    //     this.form[fieldName] = fileName;
    //     const filenameArray = fileName.split('\\');
    //     if (file.length < 1) return;
    //     // validate filetype and size here

    //     const imageFile = file[0];

    //     this.formData.append(fieldName, imageFile);

    //     this.taxRemittance[fieldName] = fileName ? filenameArray[filenameArray.length - 1] : '';
    // }

    private handleTransactionDateChange(transactionDate: string) {
        this.form.transactionDate = transactionDate;
    }

    private setCurrencyKey() {
        this.form.amountPaid.currencyKey = this.homeCurrencyKey;
    }

    private async remitTax() {
        const { amountPaid, paymentAccountKey, transactionDate } = this.form;

        const taxLiabilityRemittance: TaxLiabilityRemittanceForm = {
            amountPaid,
            paymentAccountKey,
            taxLiabilitySumKey: this.liability.taxLiabilitySumKey,
            transactionDate,
        };

        // this.requestLoadingStatus = Status.LOADING;
        // const files: Array<UploadedTaxRemittanceForms> = [];

        // for (const file of this.formData.entries()) {
        //     const newFormData = new FormData();
        //     newFormData.append('fileTag', file[0]);
        //     newFormData.append('file', file[1]);

        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     this.$set(this, 'currentUpload', file[0]);

        //     const { status, data }: any = await this.generalModule.uploadFile(newFormData);

        //     if (status === 201) {
        //         files.push(data.data);
        //     }
        // }

        // const formToBeSubmitted: RemitTaxForm = {
        //     ...this.form,
        // };

        // put the items with their url into the form
        // files.forEach((file: UploadedTaxRemittanceForms) => (formToBeSubmitted[file.fileTag] = file.fileUrl));

        await this.taxModule.remitTax(taxLiabilityRemittance);

        if (this.taxRequestStatus.remitTax === Status.SUCCESS) {
            this.form = {
                ...taxLiabilityStub,
                paymentAccountKey: '',
                transactionDate: '',
                amountPaid: { amount: 0, currencyKey: this.updatedPaymentAccounts[0].currencyKey },
            };

            this.$emit('tax-remitted');
        }
    }

    mounted() {
        this.setCurrencyKey();
    }
}
</script>
