import { ACCOUNT_TAB, HOME_TAB, INBOX_TAB, PROJECTS_TAB } from 'src/constants/navTabItems';
import {
    COMPLETE_EXTERNAL_REGISTRATION,
    FORGOT_PASSWORD_SCREEN,
    HOME_SCREEN,
    LOGIN_SCREEN,
    PROFILE_SCREEN,
    PUNCH_REPORT_SCREEN,
    RENOVATION_ESTIMATE,
    SIGN_UP_SCREEN,
    SUPPORT_QUESTION_SCREEN,
    UPLOAD_SCREEN,
    SPLASH_PARTNER_SCREEN,
    WELCOME_SIGN_IN_SCREEN,
    SIGN_UP_ENTER_PHONE_SCREEN,
    SIGN_UP_ENTER_ROLE_SCREEN,
    INSPECTION_REPORT_ON_PROCESS_SCREEN,
    INSPECTION_REPORT_WAIT_SCREEN,
    SIGN_UP_ENTER_LEAD_SOURCE_SCREEN,
    INSPECTION_RP_ROLE,
    INSPECTION_RP_SELLER_AGENT_HOMEOWNER_INFO,
    INSPECTION_RP_SELLER_AGENT_CONFIRM_INFO,
    INSPECTION_RP_SELLER_HAVE_AN_AGENT,
    INSPECTION_RP_SELLER_CONFIRM_INFO,
    INSPECTION_RP_BUYER_AGENT_OR_BUYER,
    INSPECTION_RP_SELLER_PROVIDE_INFO,
    ORDER_INSPECTION_CONFIRM_INFO,
    ORDER_INSPECTION_FILL_ADDRESS,
    ORDER_INSPECTION_PRE_SALE,
    RENOVATION_ESTIMATE_EDIT,
    INTRO_SCREEN,
    SETTING_SCREEN,
    ESTIMATE_GET_PROPOSAL,
    AUTHENTICATED,
    LOGIN,
    ESTIMATE_ADD_PROJECT,
    PROJECT_DETAILS_SCREEN,
    PROJECT_SCOPE,
    PROJECT_TEAM,
    PROJECT_PHOTOS,
    PROJECT_DOCUMENTS,
    PROJECT_TEAM_CONTACT,
    INBOX_DETAILS_SCREEN,
    INBOX_PHOTOS,
    INBOX_DOCUMENTS,
    INBOX_MEMBERS,
} from '../constants/routes';
import { GeneralEstimateItemMobileDto, GeneralEstimatePriceModifiersDto, GetItemChildrenResponseDto, RennovationEstimateDto, RequestedReportStatusEnum, ServiceItem, UserAccessTokenDto } from 'src/api/generated';
import { introScreenType } from 'src/constants';
import { RouteProp } from '@react-navigation/native';
import { IOrderInspectionFillAddress } from 'src/screens/OrderInspection/screens/OrderInspectionFillAddress/OrderInspectionFillAddress';
import { CheckedItemsArray } from 'src/screens/PunchReportScreen/PunchReportScreen';
import { ICompleteRegistration } from 'src/screens/WelcomeSignInScreen/components/AuthButtons/AuthButtons';
import { ScreenTypeForEstimateAddProjectScreen } from 'src/constants/enums';

export type NavigationParamsList = {
    [HOME_TAB]: {},
    [PROJECTS_TAB]: { activeTab?: string | undefined },
    [ACCOUNT_TAB]: {},
    [INBOX_TAB]: {},

    [WELCOME_SIGN_IN_SCREEN]: {},
    [SIGN_UP_SCREEN]: {},
    [LOGIN_SCREEN]: {},
    [FORGOT_PASSWORD_SCREEN]: {},
    [SIGN_UP_ENTER_PHONE_SCREEN]: ICompleteRegistration,
    [SIGN_UP_ENTER_ROLE_SCREEN]: ICompleteRegistration,
    [SIGN_UP_ENTER_LEAD_SOURCE_SCREEN]: ICompleteRegistration,
    [COMPLETE_EXTERNAL_REGISTRATION]: { resultSignInExternal?: UserAccessTokenDto },

    [HOME_SCREEN]: { inspectorCompanyCode?: string, },
    [PROFILE_SCREEN]: {},
    [UPLOAD_SCREEN]: { submittedViaEmail?: boolean, fileName?: string, reportRequestId?: number, submittedViaShare?: boolean, filePath?: string },
    [PUNCH_REPORT_SCREEN]: { title: string, reportRequestId: number, status?: RequestedReportStatusEnum, isFileExist?: boolean, isNotificationRedirect?: boolean, showGetProposalSuccessModal?: boolean },
    [RENOVATION_ESTIMATE]: { scrollToEnd?: true, title?: string, estimateId?: number, enterLocation?: boolean, isNotificationRedirect?: boolean, isNewEstimate?: boolean, checkRTDB?: boolean, showGetProposalSuccessModal?: boolean },
    [RENOVATION_ESTIMATE_EDIT]: { data?: RennovationEstimateDto, item: ServiceItem, estimateRouteParams: RouteProp<NavigationParamsList, "RENOVATION_ESTIMATE">, readOnly: boolean, priceModifiers: GeneralEstimatePriceModifiersDto | undefined }
    [ESTIMATE_GET_PROPOSAL]: { amplitudeLogs?: {}, estimate?: RennovationEstimateDto, }
    [SUPPORT_QUESTION_SCREEN]: {},
    [INTRO_SCREEN]: { screenType: introScreenType },
    [SETTING_SCREEN]: {},

    [SPLASH_PARTNER_SCREEN]: { partnerCode?: string },

    [INSPECTION_REPORT_ON_PROCESS_SCREEN]: { reportAddress: string, reportId?: number, status?: string, showReportSubmittedModal?: boolean, showOrderSubmittedModal?: boolean },
    [INSPECTION_REPORT_WAIT_SCREEN]: { iGoInspectionProcessingRequestId?: number },
    [INSPECTION_RP_BUYER_AGENT_OR_BUYER]: {
        title: string,
        reportRequestId: number,
        status?: RequestedReportStatusEnum | undefined,
        checkedRepairs: CheckedItemsArray,
        isFileExist?: null | boolean,
        isNotificationRedirect?: null | boolean,
        amplitudeLogs?: {},
    },
    [INSPECTION_RP_ROLE]: {
        title: string,
        reportRequestId: number,
        status?: RequestedReportStatusEnum | undefined,
        checkedRepairs: CheckedItemsArray,
        isFileExist?: null | boolean,
        isNotificationRedirect?: null | boolean,
        amplitudeLogs?: {},
    },
    [INSPECTION_RP_SELLER_PROVIDE_INFO]: {
        title: string,
        reportRequestId: number,
        status?: RequestedReportStatusEnum | undefined,
        brokerage: string,
        phoneNumber: string,
        email: string,
        checkedRepairs: CheckedItemsArray,
        isFileExist?: null | boolean,
        isNotificationRedirect?: null | boolean,
        amplitudeLogs?: {},
    },
    [INSPECTION_RP_SELLER_AGENT_HOMEOWNER_INFO]: {
        title: string,
        reportRequestId: number,
        status?: RequestedReportStatusEnum | undefined,
        brokerage: string,
        phoneNumber: string,
        email: string,
        checkedRepairs: CheckedItemsArray,
        isFileExist?: null | boolean,
        isNotificationRedirect?: null | boolean,
        amplitudeLogs?: {},
    },
    [INSPECTION_RP_SELLER_AGENT_CONFIRM_INFO]: {
        title: string,
        reportRequestId: number,
        status?: RequestedReportStatusEnum | undefined,
        brokerage: string,
        phoneNumber: string,
        email: string,
        checkedRepairs: CheckedItemsArray,
        isFileExist?: null | boolean,
        isNotificationRedirect?: null | boolean,
        amplitudeLogs?: {},
    },
    [INSPECTION_RP_SELLER_HAVE_AN_AGENT]: {
        title: string,
        reportRequestId: number,
        status?: RequestedReportStatusEnum | undefined,
        brokerage: string,
        phoneNumber: string,
        email: string,
        checkedRepairs: CheckedItemsArray,
        isFileExist?: null | boolean,
        isNotificationRedirect?: null | boolean,
        amplitudeLogs?: {},
    },
    [INSPECTION_RP_SELLER_CONFIRM_INFO]: {
        title: string,
        reportRequestId: number,
        status?: RequestedReportStatusEnum | undefined,
        brokerage: string,
        phoneNumber: string,
        email: string,
        checkedRepairs: CheckedItemsArray,
        isFileExist?: null | boolean,
        isNotificationRedirect?: null | boolean,
        amplitudeLogs?: {},
    },

    [ORDER_INSPECTION_PRE_SALE]: {},
    [ORDER_INSPECTION_CONFIRM_INFO]: { listingAddress?: IOrderInspectionFillAddress },
    [ORDER_INSPECTION_FILL_ADDRESS]: {},

    [AUTHENTICATED]: {},
    [LOGIN]: {},
    [ESTIMATE_ADD_PROJECT]: { data?: RennovationEstimateDto, treeItems?: GetItemChildrenResponseDto, screenType: ScreenTypeForEstimateAddProjectScreen },

    [PROJECT_DETAILS_SCREEN]: {},
    [PROJECT_SCOPE]: {},
    [PROJECT_TEAM]: {},
    [PROJECT_PHOTOS]: {},
    [PROJECT_DOCUMENTS]: {},
    [PROJECT_TEAM_CONTACT]: { phase?: any, isParticipant: boolean, photo: string, fullName: string, type: string, phoneNumber: string, email: string },

    [INBOX_DETAILS_SCREEN]: {},
    [INBOX_MEMBERS]: { curbioTeamList: any[] },
    [INBOX_PHOTOS]: { photos: any[] },
    [INBOX_DOCUMENTS]: { documents: any[] },
};