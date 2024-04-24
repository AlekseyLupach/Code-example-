export const profileEndpoints = {
  postThumbnailBlobName: 'api/CurbioClient/CopyUserThumbnail'
};

export const kandaEndpoints = {
  getAccountProfile: '/api/account/profile',
  updateAccountProfile: '/api/account',
  updateAccountProfileRole: '/api/account/change-role',
  getPrivacyPolicyAndTermsOfServiceWebLinks:
    '/api/Settings/terms-of-service-and-privacy-policy',
  getVerifySMSCode: '/api/account/re-request-verification-code',
  getAccountDeletionSMSCode:
    '/api/account/re-request-verification-code-for-account-deletion',
  updateLeadSource: '/api/account/how-did-you-hear-about-us',
  updateInspectorCompany: '/api/account/link-inspector-company',
  removeInspectorCompany: '/api/account/unlink-inspector-company',
  deleteAccount: '/api/account/delete-user-account',
  getDeleteAccountVerifySMSCode: '/api/account/confirm-account-deletion',
  setBiometricPublicKey: '/api/account/set-biometric-public-key',
  removeBiometricPublicKey: '/api/account/remove-biometric-public-key',
  getPunchReportsUserStatuses: '/api/Report/users-report-statuses',
  getRenovationEstimatesUserStatuses:
    '/api/RennovationEstimates/users-estimate-statuses',
  accountForgotPassword: '/api/account/forgot-password',
  accountForgotPasswordVerifySMSCode: '/api/account/verify-code',
  accountUpdatePassword: '/api/account/reset-password',
  getHomeContent: '/api/MobileHomePage/get-current-home-content',
  getHomeReсentActivities: '/api/MobileHomePage/last-estimates-and-reports',
  getHomeSupportedFeatures: '/api/Settings/get-supported-features',
  bookingOrderInspection: '/api/BookingInspection/book-inspection',
  submitSupportMessage: '/api/Support/request',
  getEstimatesList: '/api/RennovationEstimates/get-estimates-page',
  getInspectionRepairsList: '/api/Report/submitted-files',
  getInspectionRepairsReport: '/api/Report/request-repairs/v2',
  updateAddon: '/api/Report/save-addon',
  updateSelections: '/api/Report/save-selections/v2',
  shareInspectionRepairsReport: '/api/Report/share-report',
  recommendPartnerInspectionRepairsReport: '/api/Report/recommend-partner',
  requestProposalInspectionRepairsReport: '/api/Report/request-proposal',
  getModifiersPrice: '/api/GeneralEstimateItem/get-ge-price-modifiers',
  updatePushNotificationToken: '/api/PushNotifications/add-or-update',
  loginViaEmail: `/api/auth/login`,
  loginViaBiometric: `/api/auth/login-biometric-public-signature`,
  refreshToken: `/api/auth/rtoken`,
  removePartner: `/api/Partner/reset-partner`,
  loginExternal: `/api/auth/signin-external`,
  completeRegistration: `/api/account/complete-registration`,
  getIGOProfile: `/api/Report/get-user-info-from-iGo-inspection-request`,
  registrationViaEmail: `/api/account/register/v2`,
  partnerLinkIsActive: '/api/Partner/is-partner-active',
  getPartnerLinkInfo: '/api/Partner/partner-info',
  updatePartnerLink: '/api/Partner/link-partner-to-user',
  getAppVersion: `/api/AppVersion/v2/supported-versions`,
  getEstimateById: `/api/RennovationEstimates/get-saved-estimate`,
  updateEstimateModel: `/api/RennovationEstimates/save`,
  getEstimateAddressInfo: `/api/RennovationEstimates/get-address`,
  getPdfEstimateInfo: `/api/RennovationEstimates/get-before-pdf-info`,
  updatePdfEstimateInfo: `/api/RennovationEstimates/save-before-pdf-info`,
  delEstimatesListItem: `/api/RennovationEstimates/delete-estimate`,
  getEstimateTreeItems: `/api/GeneralEstimateItem`,
  requestEstimateProposal: `/api/RennovationEstimates/get-proposal-v2`,
  requestEstimateProposalRecommendPartner: `/api/RennovationEstimates/recommend-partner`,
  checkFileSize: '/api/Settings',
  checkZipCode: '/api/Report/if-zip-is-supported',
  preloadInspectionReport: '/api/Report/preload-inspection-report',
  uploadingInspectionReport: '/api/Report/v2/request',
  checkIGoInspectionId: `/api/Report/handle-iGo-inspection-report-deep-link`,
  checkEstimateStatus: `/api/RennovationEstimates/check-estimate`,
  checkShareEstimateStatus: `/api/ShareLink/check-renovation-estimate-share-link/v2`,
  checkInspectionRepairsStatus: `/api/Report/check-report-status`,
  checkShareInspectionRepairsStatus: `/api/ShareLink/check-inspection-report-share-link-v2`,
  createShareInspectionRepairsLink: `/api/ShareLink/create-report-share-link`,
  createShareEstimateLink: `/api/ShareLink/create-renovation-estimate-share-link/v2`
};

export const projectEndpoints = {
  getProjects: 'api/Project/GetProjects',
  getWithChildren: 'api/Project/GetWithChildren'
};

export const phaseEndpoints = {
  getMasterSchedules: 'api/Phase/GetMasterSchedules'
};

export const nativeEndpoints = {
  getPhaseDetails: 'api/Native/GetPhaseDetails',
  createInboxProjectPost: 'api/CurbioClient/CreateActivityPost',
  getInboxProjectPosts: 'api/Native/GetProjectPosts',
  getCalendar: 'api/Native/GetCalendar',
  getProjects: 'api/Native/GetProjects',
  getCurbioTeam: 'api/Native/GetCurbioTeam',
  getJobsWithTasks: 'api/Native/GetJobsWithTasks',
  getJobsWithTasksV2: 'api/Native/GetJobsWithTasksV2',
  getProjectMedia: 'api/Native/GetProjectMedia',
  getCalendarEventAttendees: 'api/Native/GetCalendarEventAttendees',
  getEstimateCallNowNumber: 'api/Native/GetCallNowNumber',
  getMasterSchedules: 'api/Native/GetMasterSchedules',
  getEstimateHicRealTimeAvailability: 'api/Native/HicRealTimeAvailability',
  getEstimateCalendlyUrlV2: 'api/Native/GetCalendlyUrlV2'
};
