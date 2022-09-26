import { Component, Mixins } from 'vue-property-decorator';

import { InputValidation, PaymentAccount } from '@/types';
import { MoneyObject, BankAccount } from '@/pages/Spending/Banking/types';

import { isEmpty, resetFormFields, isValidNumberInput } from '@/utils/formValidator';

import UtilityMixin from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';

const bankForm: InputValidation = {
    bankName: '',
    accountNumber: '',
    accountBalance: '',
    currency: '',
    displayName: '',
    sourceOfFund: '',
    transactionDate: '',
};

const defaultBankAccount: BankAccount = {
    bankAccountKey: '',
    bankName: '',
    displayName: '',
    accountName: '',
    accountNumber: '',
    accountBalance: {
        currencyKey: 0,
        amount: 0,
    },
    transactionDate: '',
};

@Component
export default class BankingMixin extends Mixins(UtilityMixin, CurrencyMixins) {
    public hasError(field: string): boolean {
        if (field && field.trim().length > 0) {
            return true;
        }
        return false;
    }

    public formHasError(errors: object): boolean {
        return Object.values(errors).some(value => value.length > 0);
    }

    public currencies = this.availableCurrencies;

    //Add or edit bank form validation

    public bankFormError = { ...bankForm };

    public validateBankName(name: string) {
        if (isEmpty(name)) {
            this.bankFormError['bankName'] = 'Please provide account name';
            return;
        }
        if (name.length > 50) {
            this.bankFormError['bankName'] = 'Please keep this between 1-50 characters';
            return;
        }
        this.bankFormError['bankName'] = '';
        return;
    }

    public validateAccountNumber(accountNumber: string) {
        if (isEmpty(accountNumber)) {
            this.bankFormError['accountNumber'] = 'Please provide account Number';
            return;
        }
        if (accountNumber.length < 10) {
            this.bankFormError['accountNumber'] = 'Minimum of 10 digits required';
            return;
        }
        if (accountNumber.length > 10) {
            this.bankFormError['accountNumber'] = 'Maximum of 10 digits required';
            return;
        }
        this.bankFormError['accountNumber'] = '';
        return;
    }

    public validateAccountCurrency(currency: string) {
        if (isEmpty(currency)) {
            this.bankFormError['currency'] = 'Please select a currency';
            return;
        }
        this.bankFormError['currency'] = '';
    }

    public validateAccoutBalance(accountBalance: string) {
        if (!isValidNumberInput(accountBalance)) {
            this.$nextTick(() => {
                this.bankFormError['accountBalance'] = 'Only digits required';
            });
            return;
        }
        if (!(Number(accountBalance) >= 0)) {
            this.$nextTick(() => {
                this.bankFormError['accountBalance'] = 'The imnimum amount is 0';
            });
            return;
        }

        this.bankFormError['accountBalance'] = '';
        return;
    }

    public validateBalanceAmount(balance: string): boolean {
        if (!balance) {
            this.bankFormError['accountBalance'] = '';
            return true;
        }

        if (!isValidNumberInput(balance)) {
            this.bankFormError['accountBalance'] = 'Can only contain digits';
            return false;
        }

        const balanceAmount = this.convertFormattedFiguresToNumber(balance);

        if (balanceAmount < 0) {
            this.bankFormError['accountBalance'] = 'Cannot be less than zero';
            return false;
        }

        this.bankFormError['accountBalance'] = '';
        return true;
    }

    public validateSourceOfFund(
        sourceOfFund: string,
        newAccountBalance: number,
        sourceAccountBalance: number,
        sourcesOfFund: PaymentAccount[],
    ) {
        if (sourcesOfFund.length < 1) {
            this.bankFormError['sourceOfFund'] = 'No account matches the selected currency';
            return;
        }
        if (isEmpty(sourceOfFund)) {
            this.bankFormError['sourceOfFund'] = 'Please select source of fund';
            return;
        }
        if (newAccountBalance > sourceAccountBalance) {
            this.bankFormError['sourceOfFund'] = 'This account has a lower balance than specified';
            return;
        }

        this.bankFormError['sourceOfFund'] = '';
        return;
    }

    public validateDisplayName(name: string) {
        if (!name) {
            this.bankFormError['displayName'] = 'Required';
            return;
        }

        this.bankFormError['displayName'] = '';
    }

    public validateTransactionDate(transactionDate: string): boolean {
        if (!this.isDateOnOrBeforeToday(transactionDate)) {
            this.bankFormError['transactionDate'] = 'Account Opening Date cannot be in the future';
            return false;
        }

        this.bankFormError['transactionDate'] = '';
        return true;
    }

    public validateBankForm(bankForm: {
        bankName: string;
        accountNumber: string;
        accountBalance: MoneyObject;
        displayName: string;
        transactionDate?: string;
        sourcePaymentAccountKey: string;
    }) {
        const { bankName, accountNumber, accountBalance, transactionDate } = bankForm;

        this.validateBankName(bankName);
        this.validateAccountNumber(accountNumber);
        this.validateBalanceAmount(accountBalance.amount.toString());
        this.validateAccountCurrency(accountBalance.currencyKey.toString());
        this.validateTransactionDate(transactionDate ?? '');
    }

    public get bankFormIsValidated() {
        return !this.formHasError(this.bankFormError);
    }

    public resetFormFields(form: object) {
        resetFormFields(form);
    }

    //Bank Transfer Validation
    public fundTransferError = {
        sourceAccount: '',
        destinationAccount: '',
        transferAmount: '',
        transactionDate: '',
    };

    public validateSourceAccount(sourceAccount: string, destinationAccount: string) {
        if (isEmpty(sourceAccount)) {
            this.fundTransferError['sourceAccount'] = 'please select transfer source';
            return;
        }
        this.checkTransferAccounts('source', sourceAccount, destinationAccount);
        this.fundTransferError['sourceAccount'] = '';
        return;
    }

    public validateDestinationAccount(destinationAccount: string, sourceAccount: string) {
        if (isEmpty(destinationAccount)) {
            this.fundTransferError['destinationAccount'] = 'please select transfer destination';
            return;
        }
        this.checkTransferAccounts('destination', sourceAccount, destinationAccount);
        this.fundTransferError['destinationAccount'] = '';
        return;
    }

    public checkTransferAccounts(validatingInput: string, sourceAccount: string, destinationAccount: string) {
        if (sourceAccount !== destinationAccount) {
            return;
        }
        const errorMessage = 'You cannot transfer funds to the same account';
        if (validatingInput === 'source') {
            this.$nextTick(() => {
                this.fundTransferError['sourceAccount'] = errorMessage;
            });
            return;
        }
        if (validatingInput === 'destination') {
            this.$nextTick(() => {
                this.fundTransferError['destinationAccount'] = errorMessage;
            });
            return;
        }
    }

    public validateTransferAmount(transferAmount: number, accountBalance: number) {
        if (transferAmount.toString() === '0') {
            this.fundTransferError['transferAmount'] = 'please provide transfer amount';
            return;
        }
        if (!isValidNumberInput(transferAmount.toString())) {
            this.$nextTick(() => {
                this.fundTransferError['transferAmount'] = 'Only digits required';
            });
        }
        if (this.accountBalanceIsInsufficient(accountBalance, transferAmount)) {
            this.fundTransferError['transferAmount'] = 'Your account balance is insufficient';
            return;
        }
        this.fundTransferError['transferAmount'] = '';
        return;
    }

    public validateTransferDate(transactionDate: string): boolean {
        if (!transactionDate) {
            this.fundTransferError['transactionDate'] = 'Transfer Date is compulsory!';
            return false;
        }

        if (!this.isDateOnOrBeforeToday(transactionDate)) {
            this.fundTransferError['transactionDate'] = 'Transfer Date cannot be in the future';
            return false;
        }
        this.fundTransferError['transactionDate'] = '';
        return true;
    }

    public accountBalanceIsInsufficient(accountBalance: number, transferAmount: number) {
        return transferAmount > accountBalance;
    }

    public accountBalanceIsEqualToTransferAmount(accountBalance: number, transferAmount: number) {
        return transferAmount === accountBalance;
    }

    public inputIsEmpty(inputString: string) {
        return isEmpty(inputString);
    }

    public getCashAccount(accounts: BankAccount[]) {
        const cashAccount = accounts.find(account => {
            return account.bankName.toLocaleLowerCase() === 'cash';
        });
        if (!cashAccount) return defaultBankAccount;
        return cashAccount;
    }

    public getBankAccounts(accounts: BankAccount[]) {
        const bankAccounts = accounts.filter(account => {
            return account.bankName.toLocaleLowerCase() !== 'cash';
        });
        return bankAccounts;
    }

    public getSelectedCurrency(currencyKey: number) {
        const currencyDetails = this.availableCurrencies.find(currency => {
            return currency.currencyKey === currencyKey;
        });
        if (!currencyDetails)
            return {
                currencyKey: 0,
                currencyName: '',
                currencyCode: '',
                currencySymbol: '',
            };
        return currencyDetails;
    }

    public getAccountDetails(paymentAccounts: BankAccount[], accountKey: string): BankAccount {
        const bankAccount = paymentAccounts.find(account => {
            return account.bankAccountKey === accountKey;
        });
        if (!bankAccount) return defaultBankAccount;
        return bankAccount;
    }

    public getBalanceOfSelectedAccount(paymentAccounts: BankAccount[], selectedAccountKey: string): number {
        const bankAccount = this.getAccountDetails(paymentAccounts, selectedAccountKey);
        const { amount } = bankAccount.accountBalance;
        return Number(amount);
    }

    public validateFundTranserForm(
        fundTranserForm: {
            sourceAccountKey: string;
            sourceAmount: MoneyObject;
            destinationAccountKey: string;
            destinationAmount: MoneyObject;
        },
        balance: number,
    ) {
        const { sourceAccountKey, sourceAmount, destinationAccountKey } = fundTranserForm;

        this.$nextTick(() => {
            this.validateSourceAccount(sourceAccountKey, destinationAccountKey);
            this.validateDestinationAccount(destinationAccountKey, sourceAccountKey);
            this.validateTransferAmount(Number(sourceAmount.amount), balance);
        });
    }

    public get fundTranserFormIsValidated(): boolean {
        return !this.formHasError(this.fundTransferError);
    }

    // Account Options Form Validations
    public balanceDestinationError = '';
    public accountLimitError = '';
    public generalFormError = '';

    public setGeneralError(errorMessage: string) {
        this.$nextTick(() => (this.generalFormError = errorMessage));
    }

    public clearGeneralError() {
        this.generalFormError = '';
    }

    public validateBalanceDestinationAccount(accountHasBalance: boolean, destinationAccount: string) {
        if (!accountHasBalance) return true;
        if (!destinationAccount) {
            this.balanceDestinationError = 'This is required';
            this.setGeneralError('Please select an account to move balance into');
            return false;
        }
        this.balanceDestinationError = '';
        this.clearGeneralError();
        return true;
    }

    public get accountClosureFormIsValidated() {
        return !this.hasError(this.balanceDestinationError);
    }

    public validateOverdaftLimit(limitAmount: string): boolean {
        if (isEmpty(limitAmount)) {
            this.accountLimitError = 'This is required';
            this.setGeneralError(`Please provide an overdraft limit amount`);
            return false;
        }
        if (!isValidNumberInput(limitAmount)) {
            this.accountLimitError = 'Invalid amount';
            this.setGeneralError(`Please provide limit amount in figures`);
            return false;
        }

        const principalAmount = this.convertFormattedFiguresToNumber(limitAmount);
        if (principalAmount == 0) {
            this.accountLimitError = 'Invalid amount';
            this.setGeneralError(`Please provide overdraft limit amount in figures`);
            return false;
        }

        this.accountLimitError = '';
        this.clearGeneralError();
        return true;
    }

    public get overdraftFormIsValidated() {
        return !this.hasError(this.accountLimitError);
    }
}
