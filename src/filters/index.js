import Vue from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import currencies from '@/utils/currencies';

dayjs.extend(relativeTime);

/* ============================
   DATE FILTERS
   ============================
 */
Vue.filter('localTimeAndDate', date => new Date(date).toLocaleString());
Vue.filter('localDate', date => new Date(date).toDateString());
Vue.filter('abbreviateMonth', date => {
    const [, month, , year] = date.toDateString().split(' ');
    return `${month} ${year}`;
});
Vue.filter('monthDateYearFormat', date => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
});
Vue.filter('humanReadableDateTime', date => dayjs(new Date(date)).fromNow());
Vue.filter('fullDate', date => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
});
// Vue.filter('dateMonthYearFormat', date => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(date).toLocaleDateString('en-US', options);
// });

/* ============================
   MONEY FILTERS
   ============================
 */
Vue.filter('formatMoney', value => new Intl.NumberFormat().format(value));
Vue.filter('formatPaymentType', paymentType => {
    if (paymentType === 'Bank') {
        return 'Bank Transfer';
    }

    if (paymentType === 'Cash') {
        return 'Cash Payment';
    }

    return paymentType;
});

Vue.filter('amountWithCurrency', ({ amount, currencyKey }) => {
    const amountInLocaleString = new Intl.NumberFormat().format(Math.abs(amount));
    const currencyDetails = currencies.find(currency => {
        return currency.currencyKey === currencyKey;
    });

    if (currencyDetails) {
        const { currencySymbol } = currencyDetails;
        if (amount < 0) {
            return `(${currencySymbol} ${amountInLocaleString})`;
        }
        return `${currencySymbol} ${amountInLocaleString}`;
    }
    return amountInLocaleString;
});

Vue.filter('amountWithCurrency2', ({ amount, currencyKey }) => {
    const amountInLocaleString = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(amount));
    const currencyDetails = currencies.find(currency => {
        return currency.currencyKey === currencyKey;
    });

    if (currencyDetails) {
        const { currencySymbol } = currencyDetails;
        if (amount < 0) {
            return `(${currencySymbol} ${amountInLocaleString})`;
        }
        return `${currencySymbol} ${amountInLocaleString}`;
    }
    return amountInLocaleString;
});

Vue.filter('formatAmount', value => {
    if (!value) {
        return value;
    }
    value = value.toString();
    const firstLetterOfValue = value[0];
    let formattedAmount;
    const isFirstLetterOfValueACurrency = Number.isNaN(Number(firstLetterOfValue));
    if (isFirstLetterOfValueACurrency) {
        const amount = Number(value.substring(1));
        formattedAmount = `${firstLetterOfValue} ${amount.toLocaleString('en')}`;
    } else {
        formattedAmount = Number(value).toLocaleString('en');
    }
    return formattedAmount;
});

Vue.filter('currencyCodeAndSymbol', currencyKey => {
    const currencyDetails = currencies.find(currency => {
        return currency.currencyKey === currencyKey;
    });
    if (currencyDetails) {
        return `${currencyDetails.currencyCode} (${currencyDetails.currencySymbol})`;
    }
    return '';
});

Vue.filter('formatReportAmount', amount => {
    if (!amount) return 0;

    const transformedAmount = `${amount}`.split(',').join('');
    const amountFixed = Math.abs(transformedAmount).toFixed(2);
    const amountInLocaleString = new Intl.NumberFormat().format(amountFixed);

    if (transformedAmount < 0) {
        return `(${amountInLocaleString})`;
    }

    return amountInLocaleString;
});

/* ============================
   GENERAL FILTERS
   ============================
 */
Vue.filter('initials', name => {
    if (!name) return 'N/A';
    const [firstName, lastName] = name.split(' ');

    if (!firstName) return 'N/A';

    if (!lastName) {
        return `${firstName.charAt(0).toUpperCase()}`;
    }

    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
});

Vue.filter('lowercase', value => value.toLowerCase());
Vue.filter('truncate', (value, maxLength = 20) => {
    if (typeof value !== 'string') {
        return 'This filter expects a string argument';
    }

    if (value.length > maxLength) {
        const truncatedValue = value.substring(0, maxLength);
        return `${truncatedValue.trim()}...`;
    }

    return value;
});
Vue.filter('uppercaseFirst', text => `${text.substring(0, 1).toUpperCase()}${text.substring(1)}`);
