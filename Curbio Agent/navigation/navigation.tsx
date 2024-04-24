import {
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
import React, { useEffect } from 'react';
import { PNBold } from '../constants/fonts';
import { whiteColor } from '../constants';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import UploadScreen from '../screens/UploadScreen/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import PunchReportScreen from '../screens/PunchReportScreen/PunchReportScreen';
import SplashPartnerScreen from '../screens/SplashPartnerScreen/SplashPartnerScreen';
import RenovationEstimateScreen from '../screens/RenovationEstimateScreen/RenovationEstimateScreen';
import WelcomeSignInScreen from 'src/screens/WelcomeSignInScreen/WelcomeSignInScreen';
import EmailSingInScreen from 'src/screens/EmailSingInScreen/EmailSingInScreen';
import EmailSingUpScreen from 'src/screens/EmailSingUpScreen/EmailSingUpScreen';
import SignUpEnterPhoneScreen from 'src/screens/SignUpEnterPhoneScreen/SignUpEnterPhoneScreen';
import SignUpEnterRoleScreen from 'src/screens/SignUpEnterRoleScreen/SignUpEnterRoleScreen';
import InspectionReportSubmittedScreen from 'src/screens/InspectionReportInProcessScreen/InspectionReportInProcessScreen';
import InspectionReportWaitScreen from 'src/screens/InspectionReportWaitScreen/InspectionReportWaitScreen';
import SignUpEnterLeadSourceScreen from 'src/screens/SignUpEnterLeadSourceScreen/SignUpEnterLeadSourceScreen';
import IRPRole from 'src/screens/PunchReportScreen/screens/IRPRole/IRPRole';
import OrderInspectionFillAddress from 'src/screens/OrderInspection/screens/OrderInspectionFillAddress/OrderInspectionFillAddress';
import OrderInspectionConfirmInfo from 'src/screens/OrderInspection/screens/OrderInspectionConfirmInfo/OrderInspectionConfirmInfo';
import IRPSellerAgentHomeownerInfo from 'src/screens/PunchReportScreen/screens/IRPSellerAgentHomeownerInfo/IRPSellerAgentHomeownerInfo';
import IRPSellerProvideInfo from 'src/screens/PunchReportScreen/screens/IRPSellerProvideInfo/IRPSellerProvideInfo';
import RPSellerAgentConfirmInfo from 'src/screens/PunchReportScreen/screens/RPSellerAgentConfirmInfo.tsx/RPSellerAgentConfirmInfo';
import IRPSellerHaveAnAgent from 'src/screens/PunchReportScreen/screens/IRPSellerHaveAnAgent/RPSellerHaveAnAgent';
import IRPSellerConfirmInfo from 'src/screens/PunchReportScreen/screens/IRPSellerConfirmInfo/IRPSellerConfirmInfo';
import IRPBuyerAgentOrBuyer from 'src/screens/PunchReportScreen/screens/IRPBuyerAgentOrBuyer/IRPBuyerAgentOrBuyer';
import EstimateEdit from 'src/screens/RenovationEstimateScreen/screens/EstimateEdit/EstimateEdit';
import IntroScreen from 'src/screens/IntroScreen/IntroScreen';

import SupportScreen from 'src/screens/SupportScreen/SupportScreen';
import EstimateGetProposal from 'src/screens/RenovationEstimateScreen/screens/EstimateGetProposal/EstimateGetProposal';
import { NavigationParamsList } from './types';
import TabNavigator from './tabNavigator';
import EstimateAddProject from 'src/screens/RenovationEstimateScreen/screens/EstimateAddProject/EstimateAddProject';
import ProjectDetailsScreen from 'src/screens/ProjectDetailsScreen/ProjectDetailsScreen';
import ProjectScope from 'src/screens/ProjectDetailsScreen/screens/ProjectScope/ProjectScope';
import ProjectTeam from 'src/screens/ProjectDetailsScreen/screens/ProjectTeam/ProjectTeam';
import ProjectPhotos from 'src/screens/ProjectDetailsScreen/screens/ProjectPhotos/ProjectPhotos';
import ProjectDocuments from 'src/screens/ProjectDetailsScreen/screens/ProjectDocuments/ProjectDocuments';
import ProjectTeamContact from 'src/screens/ProjectDetailsScreen/screens/ProjectTeamContact/ProjectTeamContact';
import InboxDetails from 'src/screens/InboxDetails/InboxDetails';
import InboxPhotos from 'src/screens/InboxDetails/screens/InboxPhotos/InboxPhotos';
import InboxDocuments from 'src/screens/InboxDetails/screens/InboxDocuments/InboxDocuments';
import InboxChatMember from 'src/screens/InboxDetails/screens/InboxChatMember/InboxChatMember';
import { getValue, storeValue } from 'src/Utils/common';
import { StorageKeys } from 'src/constants/storage';
import { useMutation } from '@tanstack/react-query';
import useGetAuth from 'src/services/queries/useGetAuth';
import logger from 'src/logging/applicationInsights';
import messaging, {
} from '@react-native-firebase/messaging';
import { updatePushNotificationToken } from 'src/services/NotificationService';
import { getAccountProfile } from 'src/services/ProfileService';
import { Identify, identify } from '@amplitude/analytics-react-native';
import Instabug from 'instabug-reactnative';
import { queryClient } from 'src/services/queryClient';
import { QueryKeys } from 'src/constants/enums';

export type NavigationProps = NativeStackNavigationProp<NavigationParamsList>;
const RootStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator<NavigationParamsList>();
const AuthenticatedStack = createNativeStackNavigator<NavigationParamsList>();

const AuthenticatedNavigator = () => {
    const auth = useGetAuth();
    const updatePushNotificationTokenMutation = useMutation({ mutationFn: updatePushNotificationToken })
    const getProfile = useMutation(({ mutationFn: getAccountProfile }))

    useEffect(() => {
        if (auth.userEmail) {
            const syncFcmToken = async () => {
                const fcmToken = await getValue(StorageKeys.fcmToken);
                console.log('[ FCM TOKEN TO SAVE ]', fcmToken);
                if (!fcmToken) {
                    const fcmToken = await messaging().getToken();
                    logger.trackEvent({ name: 'get fmc token for push notification', properties: { fcmtoken: fcmToken } });
                    await storeValue(StorageKeys.fcmToken, fcmToken);
                    await updatePushNotificationTokenMutation.mutateAsync({ token: fcmToken!, enabled: true })
                    return;
                }
                await updatePushNotificationTokenMutation.mutateAsync({ token: fcmToken!, enabled: true })
                await getProfile.mutateAsync(undefined, {
                    onSuccess: (resp) => {
                        queryClient.setQueryData([QueryKeys.profile], resp);
                        const identifyObj = new Identify();
                        identifyObj.set('c_Email', resp.email || '');
                        identifyObj.set('c_UserId', resp.id || '');
                        identifyObj.set('c_UserType', resp.leadSource || '');
                        identifyObj.set('c_LeadSource', resp.leadSource || '');
                        identifyObj.set(
                            'c_InspectorCompanyCode',
                            resp.inspectorCompanyCode || '',
                        );
                        identifyObj.set(
                            'c_InspectorCompanyId',
                            resp.inspectorCompanyId || '',
                        );
                        identifyObj.set(
                            'c_InspectorCompanyName',
                            resp.inspectorCompanyName || '',
                        );
                        identify(identifyObj);
                        Instabug.setUserAttribute('Email', resp.email || '');
                        Instabug.setUserAttribute('First Name', resp.firstName || '');
                        Instabug.setUserAttribute('Last Name', resp.lastName || '');
                        Instabug.identifyUser(
                            resp.email!,
                            (resp.firstName || '') + (resp.lastName || ''),
                        );
                    }
                })
            };
            syncFcmToken();
        }
    }, [auth.userEmail]);

    return (
        <AuthenticatedStack.Navigator
            initialRouteName={
                auth && auth.registrationStates?.isRegistrationCompleted ? HOME_SCREEN : WELCOME_SIGN_IN_SCREEN
            }
            screenOptions={{
                headerBackVisible: false,
                headerShown: false,
                headerTitleAlign: "center",
                animationDuration: 300,
                navigationBarColor: whiteColor,
                navigationBarHidden: false,
                headerTitleStyle: {
                    fontSize: 20,
                    fontFamily: PNBold,
                },
                headerStyle: {
                    backgroundColor: whiteColor,
                }
            }}
        >
            <>
                <AuthenticatedStack.Screen
                    name={ESTIMATE_ADD_PROJECT}
                    component={EstimateAddProject}
                />
                <AuthenticatedStack.Screen
                    name={WELCOME_SIGN_IN_SCREEN}
                    component={WelcomeSignInScreen}
                />
                <AuthenticatedStack.Screen
                    name={LOGIN_SCREEN}
                    component={EmailSingInScreen}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={SIGN_UP_SCREEN}
                    component={EmailSingUpScreen}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={SPLASH_PARTNER_SCREEN}
                    component={SplashPartnerScreen}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                    }}
                />
                <AuthenticatedStack.Screen
                    name={SIGN_UP_ENTER_PHONE_SCREEN}
                    component={SignUpEnterPhoneScreen}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                    }}
                />
                <AuthenticatedStack.Screen
                    name={SIGN_UP_ENTER_ROLE_SCREEN}
                    component={SignUpEnterRoleScreen}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                    }}
                />
                <AuthenticatedStack.Screen
                    name={SIGN_UP_ENTER_LEAD_SOURCE_SCREEN}
                    component={SignUpEnterLeadSourceScreen}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                    }}
                />
                <AuthenticatedStack.Screen
                    name={HOME_SCREEN}
                    component={TabNavigator}
                />
                <AuthenticatedStack.Screen
                    name={PROFILE_SCREEN}
                    component={ProfileScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <AuthenticatedStack.Screen
                    name={UPLOAD_SCREEN}
                    component={UploadScreen}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={PUNCH_REPORT_SCREEN}
                    component={PunchReportScreen}
                />
                <AuthenticatedStack.Screen
                    name={RENOVATION_ESTIMATE}
                    component={RenovationEstimateScreen}
                />
                <AuthenticatedStack.Screen
                    name={RENOVATION_ESTIMATE_EDIT}
                    component={EstimateEdit}
                    options={{
                        animation: 'fade',
                    }}
                />
                <AuthenticatedStack.Screen
                    name={INSPECTION_REPORT_ON_PROCESS_SCREEN}
                    component={InspectionReportSubmittedScreen}
                />
                <AuthenticatedStack.Screen
                    name={INSPECTION_REPORT_WAIT_SCREEN}
                    component={InspectionReportWaitScreen}
                />
                <AuthenticatedStack.Screen
                    name={INSPECTION_RP_BUYER_AGENT_OR_BUYER}
                    component={IRPBuyerAgentOrBuyer}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                        contentStyle: {
                            backgroundColor: whiteColor
                        }
                    }}
                />
                <AuthenticatedStack.Screen
                    name={INSPECTION_RP_ROLE}
                    component={IRPRole}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                        contentStyle: {
                            backgroundColor: whiteColor
                        }
                    }}
                />
                <AuthenticatedStack.Screen
                    name={INSPECTION_RP_SELLER_AGENT_HOMEOWNER_INFO}
                    component={IRPSellerAgentHomeownerInfo}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                        contentStyle: {
                            backgroundColor: whiteColor
                        }
                    }}
                />
                <AuthenticatedStack.Screen
                    name={INSPECTION_RP_SELLER_PROVIDE_INFO}
                    component={IRPSellerProvideInfo}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                        contentStyle: {
                            backgroundColor: whiteColor
                        }
                    }}
                />
                <AuthenticatedStack.Screen
                    name={INSPECTION_RP_SELLER_AGENT_CONFIRM_INFO}
                    component={RPSellerAgentConfirmInfo}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                        contentStyle: {
                            backgroundColor: whiteColor
                        }
                    }}
                />
                <AuthenticatedStack.Screen
                    name={INSPECTION_RP_SELLER_HAVE_AN_AGENT}
                    component={IRPSellerHaveAnAgent}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                        contentStyle: {
                            backgroundColor: whiteColor
                        }
                    }}
                />
                <AuthenticatedStack.Screen
                    name={INSPECTION_RP_SELLER_CONFIRM_INFO}
                    component={IRPSellerConfirmInfo}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                        contentStyle: {
                            backgroundColor: whiteColor
                        }
                    }}
                />
                <AuthenticatedStack.Screen
                    name={INTRO_SCREEN}
                    component={IntroScreen}
                />
                <AuthenticatedStack.Screen
                    name={ORDER_INSPECTION_FILL_ADDRESS}
                    component={OrderInspectionFillAddress}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                        contentStyle: {
                            backgroundColor: whiteColor
                        }
                    }}
                />
                <AuthenticatedStack.Screen
                    name={ORDER_INSPECTION_CONFIRM_INFO}
                    component={OrderInspectionConfirmInfo}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                        contentStyle: {
                            backgroundColor: whiteColor
                        }
                    }}
                />
                <AuthenticatedStack.Screen
                    name={ESTIMATE_GET_PROPOSAL}
                    component={EstimateGetProposal}
                    options={{
                        headerShadowVisible: false,
                        headerTitle: "",
                        headerShown: true,
                        contentStyle: {
                            backgroundColor: whiteColor
                        }
                    }}
                />
                <AuthenticatedStack.Screen
                    name={SETTING_SCREEN}
                    component={SettingsScreen}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={SUPPORT_QUESTION_SCREEN}
                    component={SupportScreen}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={FORGOT_PASSWORD_SCREEN}
                    component={ForgotPassword}
                    options={{
                        animation: "fade",
                    }}
                />
                <AuthenticatedStack.Screen
                    name={PROJECT_DETAILS_SCREEN}
                    component={ProjectDetailsScreen}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={INBOX_DETAILS_SCREEN}
                    component={InboxDetails}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={INBOX_MEMBERS}
                    component={InboxChatMember}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={INBOX_PHOTOS}
                    component={InboxPhotos}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={INBOX_DOCUMENTS}
                    component={InboxDocuments}
                    options={{ headerShown: false }}
                />

                <AuthenticatedStack.Screen
                    name={PROJECT_SCOPE}
                    component={ProjectScope}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={PROJECT_TEAM}
                    component={ProjectTeam}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={PROJECT_PHOTOS}
                    component={ProjectPhotos}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={PROJECT_DOCUMENTS}
                    component={ProjectDocuments}
                    options={{ headerShown: false }}
                />
                <AuthenticatedStack.Screen
                    name={PROJECT_TEAM_CONTACT}
                    component={ProjectTeamContact}
                    options={{ headerShown: false }}
                />
            </>
        </AuthenticatedStack.Navigator>
    )
}

const LoginNavigator = () => {

    return (
        <LoginStack.Navigator screenOptions={{
            headerShown: false,
            headerShadowVisible: false
        }}>
            <LoginStack.Screen
                name={WELCOME_SIGN_IN_SCREEN}
                component={WelcomeSignInScreen}
            />
            <LoginStack.Screen
                name={LOGIN_SCREEN}
                component={EmailSingInScreen}
                options={{ headerShown: false }}
            />
            <LoginStack.Screen
                name={SIGN_UP_SCREEN}
                component={EmailSingUpScreen}
                options={{
                    headerShown: false,
                }}
            />
            <LoginStack.Screen
                name={FORGOT_PASSWORD_SCREEN}
                component={ForgotPassword}
                options={{
                    animation: "fade",
                }}
            />
            <LoginStack.Screen
                name={SIGN_UP_ENTER_PHONE_SCREEN}
                component={SignUpEnterPhoneScreen}
                options={{
                    headerShadowVisible: false,
                    headerTitle: "",
                    headerShown: true,
                }}
            />
            <LoginStack.Screen
                name={SIGN_UP_ENTER_ROLE_SCREEN}
                component={SignUpEnterRoleScreen}
                options={{
                    headerShadowVisible: false,
                    headerTitle: "",
                    headerShown: true,
                }}
            />
            <LoginStack.Screen
                name={SIGN_UP_ENTER_LEAD_SOURCE_SCREEN}
                component={SignUpEnterLeadSourceScreen}
                options={{
                    headerShadowVisible: false,
                    headerTitle: "",
                    headerShown: true,
                }}
            />
        </LoginStack.Navigator>
    )
}

const RootNavigator = () => {
    const { refreshToken, registrationStates } = useGetAuth();

    return (
        <RootStack.Navigator
            screenOptions={{
                headerBackVisible: false,
                headerShadowVisible: false
            }}
        >
            {refreshToken && registrationStates?.isRegistrationCompleted ? (
                <RootStack.Screen
                    name={AUTHENTICATED}
                    component={AuthenticatedNavigator}
                    options={{ headerShown: false }}
                />
            ) : (
                <RootStack.Screen
                    name={LOGIN}
                    component={LoginNavigator}
                    options={{ headerShown: false }}
                />
            )}
        </RootStack.Navigator>
    )
}


export default RootNavigator;