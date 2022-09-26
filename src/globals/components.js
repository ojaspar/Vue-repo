import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VuePhoneNumberInput from 'vue-phone-number-input';
import DownloadCsv from 'vue-json-csv';

import {
    faEye,
    faSpinner,
    faEyeSlash,
    faChevronLeft,
    faUser,
    faHome,
    faPhoneAlt,
    faEnvelope,
    faUserFriends,
    faShoppingCart,
    faEdit,
    faSortAmountDown,
    faImage,
    faVenusMars,
    faExclamationTriangle,
    faCheck,
    faWeight,
    faCircle,
    faCaretRight,
    faSortUp,
    faSortDown,
    faTimes,
    faTrashAlt,
    faPencilAlt,
    faEllipsisV,
    faEllipsisH,
    faChevronRight,
    faTimesCircle,
    faSyncAlt,
    faChevronDown,
    faChevronUp,
    faHandPointLeft,
    faBars,
    faSearch,
    faPlus,
    faPlusCircle,
    faClone,
    faGift,
    faSquare,
    faCaretDown,
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faSpinner,
    faEye,
    faEyeSlash,
    faChevronLeft,
    faUser,
    faHome,
    faPhoneAlt,
    faEnvelope,
    faUserFriends,
    faShoppingCart,
    faEdit,
    faSortAmountDown,
    faImage,
    faVenusMars,
    faExclamationTriangle,
    faCheck,
    faWeight,
    faCircle,
    faCaretRight,
    faSortUp,
    faSortDown,
    faTimes,
    faTrashAlt,
    faPencilAlt,
    faEllipsisV,
    faEllipsisH,
    faChevronRight,
    faTimesCircle,
    faSyncAlt,
    faChevronDown,
    faChevronUp,
    faHandPointLeft,
    faBars,
    faSearch,
    faPlus,
    faPlusCircle,
    faClone,
    faGift,
    faSquare,
    faCaretDown,
);

/* ============================
   INPUTS
   ============================
 */

Vue.component('BaseInputField', () => import('@/components/ui/BaseInputField.vue'));
Vue.component('BaseInputFieldAuth', () => import('@/components/ui/BaseInputFieldAuth.vue'));
Vue.component('BaseSelect', () => import('@/components/ui/BaseSelect.vue'));
Vue.component('BaseTextArea', () => import('@/components/ui/BaseTextArea.vue'));
Vue.component('BaseCheckbox', () => import('@/components/ui/BaseCheckbox.vue'));
Vue.component('PlusSign', () => import('@/components/ui/PlusSign.vue'));
Vue.component('CircularPlusSign', () => import('@/components/ui/CircularPlusSign.vue'));
Vue.component('ListSearchAndAddBar', () => import('@/components/ui/ListSearchAndAddBar.vue'));
Vue.component('AvatarAndResource', () => import('@/components/ui/AvatarAndResource.vue'));
Vue.component('TabletPlusNavigationHeader', () => import('@/components/ui/TabletPlusNavigationHeader.vue'));
Vue.component('BlockErrorMessage', () => import('@/components/ui/BlockErrorMessage.vue'));
Vue.component('BaseFileInputWithBorderAndFloatingLabel', () =>
    import('@/components/ui/BaseFileInputWithBorderAndFloatingLabel.vue'),
);
Vue.component('BaseCheckboxWithBorderAndFloatingLabel', () =>
    import('@/components/ui/BaseCheckboxWithBorderAndFloatingLabel'),
);
Vue.component('BaseInputFieldWithBorderAndFloatingLabel', () =>
    import('@/components/ui/BaseInputFieldWithBorderAndFloatingLabel.vue'),
);
Vue.component('BaseTextAreaWithBorderAndFloatingLabel', () =>
    import('@/components/ui/BaseTextAreaWithBorderAndFloatingLabel.vue'),
);
Vue.component('BaseSelectWithBorderAndFloatingLabel', () =>
    import('@/components/ui/BaseSelectWithBorderAndFloatingLabel.vue'),
);
Vue.component('BaseRadioGroupWithBorderAndFloatingLabel', () =>
    import('@/components/ui/BaseRadioGroupWithBorderAndFloatingLabel.vue'),
);
Vue.component('BaseDateFieldWithBorderAndFloatingLabel', () =>
    import('@/components/ui/BaseDateFieldWithBorderAndFloatingLabel.vue'),
);
Vue.component('VuePhoneNumberInput', VuePhoneNumberInput);

/* ============================
   BUTTONS
   ============================
 */

Vue.component('BaseButton', () => import('@/components/ui/BaseButton.vue'));
Vue.component('CircularPlusSign', () => import('@/components/ui/CircularPlusSign.vue'));
Vue.component('BasePrimaryButton', () => import('@/components/ui/BasePrimaryButton.vue'));
Vue.component('BaseSecondaryButton', () => import('@/components/ui/BaseSecondaryButton.vue'));
Vue.component('PlusSign', () => import('@/components/ui/PlusSign.vue'));
Vue.component('BaseActionButton', () => import('@/components/ui/BaseActionButton.vue'));
Vue.component('BasePlainButton', () => import('@/components/ui/BasePlainButton.vue'));

/* ============================
   NOTIFICATIONS
   ============================
 */

Vue.component('ProgressBar', () => import('@/components/ui/ProgressBar.vue'));
Vue.component('Error', () => import('@/components/ui/Error.vue'));
Vue.component('ToasterIcon', () => import('@/components/ui/ToasterIcon.vue'));
Vue.component('Toaster', () => import('@/components/ui/Toaster.vue'));
Vue.component('BlockErrorMessage', () => import('@/components/ui/BlockErrorMessage.vue'));
Vue.component('ErrorMessage', () => import('@/components/ui/ErrorMessage.vue'));
Vue.component('SuccessPage', () => import('@/components/ui/SuccessPage.vue'));
Vue.component('GeneralFormError', () => import('@/components/ui/GeneralFormError.vue'));

/* ============================
   GENERAL
   ============================
 */

Vue.component('Loader', () => import('@/components/ui/Loader.vue'));
Vue.component('MzuriLogo', () => import('@/components/ui/MzuriLogo.vue'));
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('ListSearchAndAddBar', () => import('@/components/ui/ListSearchAndAddBar.vue'));
Vue.component('ListDropdownAndAddBar', () => import('@/components/ui/ListDropdownAndAddBar.vue'));
Vue.component('AvatarAndResource', () => import('@/components/ui/AvatarAndResource.vue'));
Vue.component('TabletPlusNavigationHeader', () => import('@/components/ui/TabletPlusNavigationHeader.vue'));
Vue.component('AddNewEntityWithPlusIconButton', () => import('@/components/ui/AddNewEntityWithPlusIconButton.vue'));
Vue.component('DashboardBreadCrumb', () => import('@/components/ui/DashboardBreadCrumb.vue'));
Vue.component('ManagementModuleTopSection', () => import('@/components/ui/ManagementModuleTopSection.vue'));
Vue.component('DashboardStatusFilter', () => import('@/components/ui/DashboardStatusFilter.vue'));
Vue.component('TransactionStatsCards', () => import('@/components/ui/TransactionStatsCards.vue'));
Vue.component('MobileHeader', () => import('@/components/ui/MobileHeader.vue'));
Vue.component('TransactionMidSection', () => import('@/components/ui/TransactionPageMidSection.vue'));
Vue.component('SingleTransactionStatsCard', () => import('@/components/ui/SingleTransactionStatsCard.vue'));
Vue.component('ShowResourceOnClick', () => import('@/components/ui/ShowResourceOnClick.vue'));
Vue.component('BaseModal', () => import('@/components/ui/BaseModal.vue'));
Vue.component('DownloadCsv', DownloadCsv);
Vue.component('ProgressTracker', () => import('@/components/ui/ProgressTracker.vue'));
Vue.component('FullPageLoader', () => import('@/components/ui/FullPageLoader.vue'));
Vue.component('FormattedDatePicker', () => import('@/components/ui/FormattedDatePicker.vue'));
Vue.component('BaseRouterView', () => import('@/components/ui/BaseRouterView.vue'));
Vue.component('DeleteModal', () => import('@/components/ui/DeleteModal.vue'));
Vue.component('PeriodicRangeTab', () => import('@/components/ui/PeriodicRangeTab.vue'));
Vue.component('DashboardCard', () => import('@/components/ui/DashboardCards/DashboardCard.vue'));
Vue.component('IconBase', () => import('@/components/ui/IconBase.vue'));
Vue.component('QuickActions', () => import('@/components/ui/QuickActions.vue'));
