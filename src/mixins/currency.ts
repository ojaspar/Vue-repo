import { Component, Vue } from 'vue-property-decorator';

import { Currency, Token, tokenDefaultValue } from '@/types';
import SessionStorageService from '@/services/sessionStorage';

// import Currencies from '@/utils/currencies';

@Component
export default class CurrencyMixins extends Vue {
    public selectedCurrencyObject: Currency = {
        currencyKey: 0,
        currencyName: '',
        currencyCode: '',
        currencySymbol: '',
    };
    public authenticatedUser: Token = tokenDefaultValue;

    public errors = {
        currency: '',
    };

    get availableCurrencies() {
        return [
            {
                currencyKey: 566,
                currencyName: 'Nigerian Naira',
                currencyCode: 'NGN',
                currencySymbol: '₦',
            },
        ];
        // return Currencies.sort((a: Currency, b: Currency) => {
        //     if (a.currencyName > b.currencyName) {
        //         return 1;
        //     }
        //     if (a.currencyName < b.currencyName) {
        //         return -1;
        //     }
        //     return 0;
        // });
    }

    get homeCurrencyKey(): number {
        this.authenticatedUser = SessionStorageService.decodeToken();
        const { currencyKey } = this.authenticatedUser;
        return Number(currencyKey);
    }

    get defaultCurrency(): Currency {
        const token = SessionStorageService.decodeToken();
        const defaultCurrency = this.getCurrencyObjectFromCurrencyKey(token.currencyKey);
        return defaultCurrency;
    }

    get conditionForSelectingACurrencyInParenthesis() {
        return `${this.selectedCurrencyObject.currencySymbol ? `(${this.selectedCurrencyObject.currencySymbol})` : ''}`;
    }

    public getCurrencyObjectFromCurrencyKey(suppliedCurrencyKey: string | number): Currency {
        const result = this.availableCurrencies.filter(
            currencyObject => currencyObject.currencyKey.toString() === suppliedCurrencyKey.toString(),
        );
        return result[0];
    }

    public getCurrencyObjectArrayFromListOfCurrency(currencyKeyList: Array<Currency>) {
        const currencyObjectArray = currencyKeyList.map(currencyKeyObject => {
            return this.getCurrencyObjectFromCurrencyKey(currencyKeyObject.currencyKey.toString());
        });
        return currencyObjectArray;
    }

    public getCurrencySymbolFromCurrencyKey(suppliedCurrencyKey: string | number) {
        return this.getCurrencyObjectFromCurrencyKey(suppliedCurrencyKey)?.currencySymbol;
    }

    public handleCurrencyChange(currencyKey: string) {
        this.selectedCurrencyObject = this.getCurrencyObjectFromCurrencyKey(currencyKey);
        this.$nextTick(() => {
            this.validateCurrency();
        });
    }

    public defaultCurrencySymbolFromCurrencyKey(specifiedCurrencyKey: number | string = 566) {
        // this method is required to prevent any errors that come from an undefined currencyKey
        // such an instance may occur if only the specified financial month is selected and the
        // preview page is navigated to without filling the rest
        if (specifiedCurrencyKey) {
            return this.getCurrencySymbolFromCurrencyKey(specifiedCurrencyKey.toString());
        } else {
            return this.getCurrencySymbolFromCurrencyKey(this.homeCurrencyKey.toString());
        }
    }

    public validateCurrency() {
        if (!this.selectedCurrencyObject.currencyKey) {
            this.errors.currency = 'Please select a currency';
        } else {
            this.errors.currency = '';
        }
    }

    public wrapFloatingLabelTextWithCurrencySymbol(floatingLabelText: string, currencyKey: string | number): string {
        if (currencyKey) {
            return `${floatingLabelText} (${this.getCurrencySymbolFromCurrencyKey(currencyKey.toString())})`;
        }
        return floatingLabelText;
    }

    public roundN(value: number, n: number) {
        return Number(Math.round(Number(value + 'e' + n)) + 'e-' + n).toFixed(n);
    }
}
