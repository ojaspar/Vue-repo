import { MoneyObject } from '@/types';

export enum ServiceRedemptionStatus {
    FUFILLED = 'Fufilled',
    NOT_FUFILLED = 'Not Fufilled',
}

export interface PledgeRedemption {
    amountToBeRedeemed: MoneyObject;
    pledgeDueDate: string;
    redemptionStatus: ServiceRedemptionStatus;
    quantityRedeemed: number;
    paymentAccountKey: string;
}
