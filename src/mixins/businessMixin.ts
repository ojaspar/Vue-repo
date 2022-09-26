import { Component, Vue } from 'vue-property-decorator';

import businessVerticals, { BusinessVerticalCodes } from '@/utils/businessVerticals';

import { BusinessVerticalDetail, Token } from '@/types';
import SessionStorageService from '@/services/sessionStorage';

@Component
export default class BusinessMixin extends Vue {
    get businessVerticals(): Array<BusinessVerticalDetail> {
        return businessVerticals.sort(
            (businessVerticalA: BusinessVerticalDetail, businessVerticalB: BusinessVerticalDetail) => {
                const nameA = businessVerticalA.name.toUpperCase();
                const nameB = businessVerticalB.name.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            },
        );
    }

    get businessIsANgo(): boolean {
        // get loggedInUser businessVerticalCode
        const user: Token = SessionStorageService.decodeToken();
        if (user) {
            return user.businessVerticalCode === BusinessVerticalCodes.NGO;
        }

        return false;
    }
}
