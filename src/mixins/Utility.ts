/*eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue } from 'vue-property-decorator';

import { MoneyObject, PaymentAccount, Toaster, VueExtension } from '@/types';

@Component
class UtilityMixins extends Vue {
    public $root!: VueExtension;

    public coloursArray: string[] = [
        '#007bff',
        '#6610f2',
        '#6f42c1',
        '#e83e8c',
        '#dc3545',
        '#fd7e14',
        '#28a745',
        '#20c997',
        '#70B056',
    ];

    public $options!: {
        filters: {
            humanReadableDateTime: Function;
            amountWithCurrency: Function;
            truncate: Function;
            monthDateYearFormat: Function;
            formatMoney: Function;
        };
    };

    get userIsOnDesktop(): boolean {
        return this.$root.isLargeScreenSize;
    }

    get userIsOnMobile(): boolean {
        return this.$root.isMobileScreenSize;
    }

    get currentWindowWidth(): number {
        return this.$root.$data.windowWidth;
    }

    get userIsOnTablet(): boolean {
        return this.$root.isMediumScreenSize;
    }

    get isXtraSmallscreen(): boolean {
        return this.currentWindowWidth <= 575;
    }

    get userIsOnTabletPortrait(): boolean {
        return this.$root.isTabletPortraitSize;
    }

    get randomColor(): string {
        const lengthOfColorArray = this.coloursArray.length;
        const min = Math.ceil(1);
        const max = Math.floor(lengthOfColorArray);
        const randomIndex = Math.floor(Math.random() * (max - min + 1) + min);

        return this.coloursArray[randomIndex];
    }

    //the VAT type/option key which requires 7.5% VAT charges
    public vatAdditionKey = process.env.VUE_APP_VAT_ADDITION_KEY;

    //the VAT type/option key for VAT charges to be inclusive
    public vatInclusiveKey = process.env.VUE_APP_VAT_INCLUSIVE_KEY;

    public daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    public monthsOfTheYear: string[] = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    public currentMonth = new Date().getMonth();
    public currentYear = new Date().getFullYear();

    get monthsTillCurrentMonth(): string[] {
        const { currentYear, monthsOfTheYear, currentMonth } = this;

        return monthsOfTheYear.slice(0, currentMonth + 1).map(month => `${month} ${currentYear}`);
    }

    get currentMonthWithYear(): string {
        return `${this.monthsOfTheYear[this.currentMonth]} ${this.currentYear}`;
    }

    get currentMonthInWords() {
        const currentMonthInWords = this.monthsOfTheYear[this.currentMonth];
        return currentMonthInWords;
    }

    public weekDayInWords(daysDate: number): string {
        return this.daysOfTheWeek[daysDate];
    }

    public formattedAmountWithCurrency(amount: number) {
        return `₦${this.formatAmountThatCannotBeFiltered(amount)}`;
    }

    public formatAmountThatCannotBeFiltered(value: string | number): string {
        return value.toLocaleString('en');
    }

    public removeProductFromSelectedProducts<T>(arrayOfItems: Array<T>, indexOfDeletedItem: number) {
        arrayOfItems.splice(indexOfDeletedItem, 1);
    }

    public formatFiguresToCurrency = (input: string): string => {
        if (!input || input.length === 0) return '';

        let inputSource = input;

        if (isFinite(Number(inputSource))) {
            inputSource = inputSource.toString();
        }

        // importantly, we wil strip out all the special characters keeping only the decimals '9,000,____00****0.008.999-----' will output 900000.008.999
        const inputWithDecimalPointsOnly = inputSource.replace(/[^0-9.]/g, '');

        // we will assign the value we got now, in case it is good enough already, if it is something like *900000 or 900000.008
        let inputReadyToBeFormattedToNumber = inputWithDecimalPointsOnly;

        // we need to convert the stripped input to an array incase there are multiple decimal places in it *990990.9.9*
        const splitByDecimals = inputReadyToBeFormattedToNumber.split('.');

        // if there are more than 2 values in this array, it means the user provided something like *9000.9.9*, so we will just keep the first decimal place
        // splitByDecimals = ['900000', '008', '999'];
        if (splitByDecimals.length > 2) {
            const [main, ...floatingPoint] = splitByDecimals; // ['900000', ['008', '999']]
            const floatingPointToDecimal = floatingPoint.join(''); // '008999'
            inputReadyToBeFormattedToNumber = `${main}.${floatingPointToDecimal}`;
        }

        // now, we have 900000.008999 that is ready to converted to Currency format
        return Number(inputReadyToBeFormattedToNumber).toLocaleString('en-US', { maximumFractionDigits: 3 });
    };

    public convertFormattedFiguresToNumber = (formattedFigures: string): number => {
        const stringValueWithNoSpaces = formattedFigures.replace(/,/g, '');
        const numberToTwoDecimalPlaces = Number(stringValueWithNoSpaces).toFixed(2);
        return Number(numberToTwoDecimalPlaces);
    };

    public convertFigureToCurrency(input: number | string): string;
    public convertFigureToCurrency(input: number[] | string[]): string[];
    public convertFigureToCurrency(input: any): any {
        if (Array.isArray(input)) {
            const formattedNumbers = input.map(value => this.formatFiguresToCurrency(value));
            return formattedNumbers;
        }
        return this.formatFiguresToCurrency(input);
    }

    public convertFormattedCurrencyToNumber(currency: string): number;
    public convertFormattedCurrencyToNumber(currency: string[]): number[];
    public convertFormattedCurrencyToNumber(currency: any): any {
        if (Array.isArray(currency)) {
            const formattedNumbers = currency.map(value => this.convertFormattedFiguresToNumber(value));
            return formattedNumbers;
        }
        return this.convertFormattedFiguresToNumber(currency);
    }

    public addDays(date: Date, daysToAdd: number) {
        return new Date(date.valueOf() + daysToAdd * 1000 * 60 * 60 * 24);
    }

    public moveDate(oldBaseDate: string, oldDate: string, newBaseDate: string): string {
        const oldBase = new Date(oldBaseDate);
        const old = new Date(oldDate);
        const newBase = new Date(newBaseDate);

        const dateDiff = old.valueOf() - oldBase.valueOf();
        const daysDiff = Math.round(dateDiff / (1000 * 60 * 60 * 24));

        const newDate = new Date(newBase.valueOf());

        return this.formatDateToFitCalendarFormat(this.addDays(newDate, daysDiff).toString());
    }

    public todayAsDefaultDate(): string {
        const [month, day, year] = new Date().toLocaleDateString().split('/');
        const transformedDay = Number(day) < 10 ? `0${Number(day)}` : Number(day);
        const transformedMonth = Number(month) < 10 ? `0${Number(month)}` : Number(month);
        return [year, transformedMonth, transformedDay].join('-');
    }

    public transformDate(date: string) {
        const [month, day, year] = new Date(date).toLocaleDateString().split('/');

        const transformedDay = Number(day) < 10 ? `0${Number(day)}` : Number(day);
        const transformedMonth = Number(month) < 10 ? `0${Number(month)}` : Number(month);
        return { year, month: transformedMonth, day: transformedDay };
    }

    public formatDateToFitCalendarFormat(date: string) {
        if (!date) return '';

        const { year, month, day } = this.transformDate(date);
        return [year, month, day].join('-');
    }

    public formatDateToFitUKFormat(date: string) {
        if (!date) return '';

        const { year, month, day } = this.transformDate(date);
        return [day, month, year].join('-');
    }

    public isDateOnOrBeforeToday(selectedDate: string) {
        return new Date(selectedDate) < new Date();
    }

    public isDateOnOrAfterToday(selectedDate: string) {
        return new Date(selectedDate) >= new Date() || selectedDate === this.todayAsDefaultDate();
    }

    public preventBlurFromHappening(e: Event) {
        e.preventDefault();
    }

    public isDateBeforeToday(date: string): boolean {
        const todaysDate = new Date(new Date().toDateString());
        const selectedDate = new Date(new Date(date).toDateString());
        if (selectedDate >= todaysDate) return false;
        return todaysDate > selectedDate;
    }

    public isDateAfterToday(date: string): boolean {
        const todaysDate = new Date(new Date().toDateString());
        const selectedDate = new Date(new Date(date).toDateString());
        if (selectedDate <= todaysDate) return false;
        return todaysDate < selectedDate;
    }

    public toaster: Toaster = {
        type: '',
        title: '',
        message: '',
        id: '',
    };

    public showToaster({ type, title, message, id, position }: Toaster): void {
        this.toaster.type = type;
        this.toaster.title = title;
        this.toaster.message = message;
        this.toaster.position = position;
        this.toaster.id = id;
        this.$nextTick(() => this.$bvToast.show(id));
    }

    public getMonthWithYear(monthWithoutYear: string, year: number): string {
        return `${monthWithoutYear} ${year}`;
    }

    public getMonthWithoutYear(monthWithYear: string): string {
        return monthWithYear.split(' ')[0];
    }

    public amountInPercentage(amount: number, target: number, includeSymbol = true): string {
        const amountInPercentage = (amount * 100) / target;
        const symbol = includeSymbol ? '%' : '';
        //if the above evaluation results in a number with decimal
        if (amountInPercentage % 1 != 0) {
            return `${amountInPercentage.toFixed(2)}${symbol}`;
        }
        return `${amountInPercentage}${symbol}`;
    }

    public prepareCustomer(customers: any[]): any[] {
        return customers.map(customer => {
            return {
                ...customer,
                lastInteractionAge: customer.lastInteractionDate
                    ? this.$options.filters.humanReadableDateTime(customer.lastInteractionDate)
                    : '',
            };
        });
    }

    public prepareProducts(products: any[]): any[] {
        return products.map(product => {
            return {
                ...product,
                lastSaleAge: product.lastSaleDate
                    ? this.$options.filters.humanReadableDateTime(product.lastSaleDate)
                    : '',
            };
        });
    }

    public sortArrayByName(arrayToSort: any[]): any[] {
        return arrayToSort.slice().sort((firstElement, secondElement): number => {
            const firstName = firstElement.name.toUpperCase();
            const secondName = secondElement.name.toUpperCase();
            return firstName < secondName ? -1 : firstName > secondName ? 1 : 0;
        });
    }

    public sortByInteractionDate(arrayToSort: any[], proprertyName: string): any[] {
        return arrayToSort.slice().sort((firstElement, secondElement): number => {
            let firstDate, secondDate;
            Object.keys(firstElement).forEach(key => {
                if (key === proprertyName) {
                    firstDate = firstElement[key];
                }
            });
            Object.keys(secondElement).forEach(key => {
                if (key === proprertyName) {
                    secondDate = secondElement[key];
                }
            });

            if (!firstDate && !secondDate) return 0;
            if (!firstDate) return 1;
            if (!secondDate) return -1;
            return firstDate > secondDate ? -1 : firstDate < secondDate ? 1 : 0;
        });
    }

    //incldues the displayNameWithBalance property in each payment account
    public updatePaymentAccounts(paymentAccounts: any[]): Array<PaymentAccount> {
        return paymentAccounts.map(pa => {
            const accountBalanceIsNumber: boolean = typeof pa.accountBalance === 'number' ?? false;
            const accountBalance: number = accountBalanceIsNumber ? pa.accountBalance : pa.accountBalance.amount;
            const currencyKey: string = accountBalanceIsNumber ? pa.currencyKey : pa.accountBalance.currencyKey;
            const amountWithCurrency: MoneyObject = accountBalanceIsNumber
                ? { amount: accountBalance, currencyKey }
                : pa.accountBalance;
            const paymentAccountKey: string = accountBalanceIsNumber ? pa.paymentAccountKey : pa.bankAccountKey;
            return {
                displayName: pa.displayName,
                accountBalance: Number(accountBalance),
                currencyKey: Number(currencyKey),
                paymentAccountKey,
                displayNameWithBalance: `${pa.displayName} [${this.$options.filters.amountWithCurrency(
                    amountWithCurrency,
                )}]`,
            };
        });
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    public areAnyFieldsInFormFilled(formFieldsObject: any): boolean {
        return Object.values(formFieldsObject).some((field: any) => {
            if (typeof field === 'string') {
                // if the value is a string check if
                return field.length > 0;
            }
            if (typeof field === 'object') {
                // if the field is an array
                // if the field has an amount key in the case of a money object
                return Number(field.amount) > 0;
            }
            return false;
        });
    }
    public displayModal(modalId: string) {
        this.$nextTick(() => {
            this.$bvModal.show(modalId);
        });
    }

    public cancelModal(modalId: string) {
        this.$nextTick(() => {
            this.$bvModal.hide(modalId);
        });
    }

    public focusOnElement(htmlElement: HTMLFormElement) {
        let element: any = [];
        element = htmlElement;
        element[0].focus();
    }

    public openModal(modalId: string) {
        this.$bvModal.show(modalId);
    }

    public closeModal(modalId: string) {
        this.$bvModal.hide(modalId);
    }
}

export default UtilityMixins;
