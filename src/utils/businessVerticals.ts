import { BusinessVerticalDetail } from '@/types';

const businessVerticals: Array<BusinessVerticalDetail> = [
    { code: '01', name: 'Fashion' },
    { code: '02', name: 'Catering' },
    { code: '03', name: 'Furniture' },
    { code: '04', name: 'Fish Farm' },
    { code: '05', name: 'Laundry' },
    { code: '06', name: 'Poultry' },
    { code: '07', name: 'Electronic Merchant' },
    { code: '08', name: 'School' },
    { code: '09', name: 'Bookshop' },
    { code: '10', name: 'Standard' },
    { code: '11', name: 'Non-Governmental Organizations / Charities' },
];

export enum BusinessVerticalCodes {
    'Fashion' = '01',
    'Fish Farm' = '04',
    'Furniture' = '03',
    'Laundry' = '05',
    'Poultry' = '06',
    'Electronic-Merchant' = '07',
    'School' = '08',
    'Catering' = '02',
    'Bookshop' = '09',
    'Standard' = '10',
    'NGO' = '11',
}

export default businessVerticals;
