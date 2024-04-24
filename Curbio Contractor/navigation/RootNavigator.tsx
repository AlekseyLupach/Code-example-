import {
  NativeStackNavigationProp,
  createNativeStackNavigator
} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import * as Screens from '../screens';
import * as Names from '../constants/screens';
import HeaderBackButton from '../components/Navigation/HeaderBackButton/HeaderBackButton';
import { useMutation, useQuery } from '@tanstack/react-query';
import useMe from '../services/queries/useMe';
import { useEffect } from 'react';
import { getValue } from '../utils/common';
import { StorageKeys } from '../constants/storage';
import {
  updateSubcontractorEmployeeFcmToken,
  updateNativeUserFcmToken
} from '../services/ProfileService';
import { Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../screens/RegisterPhotoScreen/styles';
import { typography } from '../config/theme';
import { QueryKeys } from '../services/queries/queryKeys';
import React from 'react';
import { MainNavigatorParams } from './types';
import { View } from 'react-native';
import HeaderTitle from '../components/Navigation/HeaderTitle/HeaderTitle';
import { isAndroidPlatform } from '../constants';
import DisappearingNotification from '../components/Alerts/DisappearingNotification/DisappearingNotification';
import useGetError from '../services/queries/useGetError';
import { queryClient } from '../services/queryClient';

const RootStack = createNativeStackNavigator<MainNavigatorParams>();
const LoginStack = createNativeStackNavigator<MainNavigatorParams>();
const AuthenticatedStack = createNativeStackNavigator<MainNavigatorParams>();
type NavigationProps = NativeStackNavigationProp<
  MainNavigatorParams,
  'Projects'
>;

const AuthenticatedNavigator = () => {
  const navigation = useNavigation<NavigationProps>();
  const updateUserFcmMutation = useMutation(updateNativeUserFcmToken);
  const updateSubcontractorEmployeeFcmMutation = useMutation(
    updateSubcontractorEmployeeFcmToken
  );
  const errorQuery = useGetError()
  const me = useMe()

  useEffect(() => {
    const syncFcmToken = async () => {
      const fcmToken = await getValue(StorageKeys.fcmToken);
      console.log('[ FCM TOKEN TO SAVE ]', fcmToken);

      if (fcmToken) {
        if (me && me.data && me.data.userId) {
          updateSubcontractorEmployeeFcmMutation.mutate({
            ...me.data,
            fcmRegistrationToken: fcmToken
          });
        } else {
          updateUserFcmMutation.mutate({
            ...me?.data,
            fcmRegistrationToken: fcmToken
          });
        }
      }
    };
    syncFcmToken();
  }, []);

  return (
    <>
      <AuthenticatedStack.Navigator>
        <AuthenticatedStack.Screen
          name={Names.HOME_NAVIGATOR}
          options={{
            headerShown: false
          }}>
          {() => (
            <TabNavigator
              subcontractorEmployeeTypeId={me?.data?.subcontractorEmployeeTypeId}
            />
          )}
        </AuthenticatedStack.Screen>
        <AuthenticatedStack.Screen
          name={Names.CHECK_IN_CREW_SCREEN}
          component={Screens.CheckInCrew}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.CHECK_IN_PEOPLE_SCREEN}
          component={Screens.CheckInPeople}
          options={{
            headerTitle: '',
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            ),
            headerShadowVisible: false
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.CHECK_IN_OUT_PHOTO_SCREEN}
          component={Screens.CheckInOutPhoto}
          options={{
            headerTitle: '',
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            ),
            headerShadowVisible: false
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.COMPANY_SEARCH_SCREEN}
          component={Screens.CompanySearch}
          options={{
            headerTitle: '',
            headerLeft: (props) => <HeaderBackButton {...props} />,
            headerShadowVisible: false
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.REGISTER_NAME_SCREEN}
          component={Screens.RegisterName}
          options={{
            headerShown: false,
            headerShadowVisible: false,
            headerTitle: '',
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.REGISTER_PHOTO_SCREEN}
          component={Screens.RegisterPhoto}
          options={{
            headerShown: true,
            headerTitle: '',
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            ),
            headerRight: (props) => (
              <Text
                style={styles.navHeaderRight}
                onPress={() => navigation.navigate(Names.PROJECTS_LISTS_SCREEN)}>
                Skip
              </Text>
            ),
            headerShadowVisible: false
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.REGISTER_CREW_LEAD_SCREEN}
          component={Screens.RegisterCrewLead}
          options={{
            headerShown: true,
            headerTitle: '',
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            ),
            headerShadowVisible: false
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.REGISTER_COMPANY_SCREEN}
          component={Screens.RegisterCompany}
          options={{
            headerShown: true,
            headerTitle: '',
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            ),
            headerShadowVisible: false
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.ACCOUNT_SETTINGS_SCREEN}
          component={Screens.AccountSettings}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.TEAM_MEMBER_ADD_SCREEN}
          component={Screens.TeamMemberAdd}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => <HeaderBackButton {...props} />
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.TEAM_MEMBER_EDIT_SCREEN}
          component={Screens.TeamMemberEdit}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.TEAM_MEMBER_DETAILS_SCREEN}
          component={Screens.TeamMemberDetails}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.CREW_APPROVAL_SCREEN}
          component={Screens.CrewApproval}
          options={{
            headerTitle: '',
            headerShown: false,
            headerShadowVisible: false
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.PRIVACY_POLICY_SCREEN}
          component={Screens.PrivacyPolicy}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.TERMS_CONDITIONS_SCREEN}
          component={Screens.TermsConditions}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.MSA_SCREEN}
          component={Screens.MSA}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.JOB_DETAILS_SCREEN}
          component={Screens.JobDetails}
          options={{
            headerShadowVisible: false,
            headerLeft: (props) => <HeaderBackButton {...props} />
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.WEBVIEW_SCREEN}
          component={Screens.Webview}
        />
        <AuthenticatedStack.Screen
          name={Names.SCOPE_OF_WORK_SCREEN}
          component={Screens.ScopeOfWork}
          options={{
            headerShadowVisible: false,
            headerTitle: '',
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.PAYMENTS_SCREEN}
          component={Screens.Payments}
          options={{
            headerShadowVisible: false,
            headerLeft: (props) => <HeaderBackButton {...props} />,
            headerTitle: (props) => (
              <HeaderTitle
                {...props}
                containerStyle={{ marginLeft: isAndroidPlatform ? -25 : 0 }}
              />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.SCHEDULE_SCREEN}
          component={Screens.Schedule}
          options={{
            headerTitleStyle: {
              ...typography.h2
            },
            headerTitleAlign: 'left',
            headerShadowVisible: false
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.CHAT_SCREEN}
          component={Screens.Chat}
          options={{
            headerShown: true,
            headerShadowVisible: true,
            headerTitle: ''
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.CHAT_DETAILS_SCREEN}
          component={Screens.ChatDetails}
          options={{
            headerShown: true,
            headerShadowVisible: false,
            headerTitle: ''
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.PHOTOS_SCREEN}
          component={Screens.Photos}
          options={{
            headerShadowVisible: false,
            headerLeft: (props) => <HeaderBackButton {...props} />,
            headerTitle: (props) => (
              <HeaderTitle
                {...props}
                containerStyle={{ marginLeft: isAndroidPlatform ? -25 : 0 }}
              />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.PHOTOS_PREVIEW_SCREEN}
          component={Screens.PhotosPreview}
          options={{
            headerShadowVisible: false,
            headerTitle: '',
            headerLeft: (props) => <HeaderBackButton {...props} />
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.DOCUMENTS_SCREEN}
          component={Screens.Documents}
          options={{
            headerShadowVisible: false,
            headerLeft: (props) => <HeaderBackButton {...props} />,
            headerTitle: (props) => (
              <HeaderTitle
                {...props}
                containerStyle={{ marginLeft: isAndroidPlatform ? -25 : 0 }}
              />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.PROJECT_TEAM_SCREEN}
          component={Screens.ProjectTeam}
          options={{
            headerShadowVisible: false,
            headerLeft: (props) => <HeaderBackButton {...props} />,
            headerTitle: (props) => (
              <HeaderTitle
                {...props}
                containerStyle={{ marginLeft: isAndroidPlatform ? -25 : 0 }}
              />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.LINKS_SCREEN}
          component={Screens.Links}
          options={{
            headerShadowVisible: false,
            headerLeft: (props) => <HeaderBackButton {...props} />,
            headerTitle: (props) => (
              <HeaderTitle
                {...props}
                containerStyle={{ marginLeft: isAndroidPlatform ? -25 : 0 }}
              />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.BID_DETAILS_SCREEN}
          component={Screens.BidDetails}
          options={{
            headerShadowVisible: false,
            headerLeft: (props) => <HeaderBackButton {...props} />,
            headerTitle: (props) => (
              <HeaderTitle
                {...props}
                containerStyle={{ marginLeft: isAndroidPlatform ? -25 : 0 }}
              />
            )
          }}
        />
        <AuthenticatedStack.Screen
          name={Names.BID_LANDING_SCREEN}
          component={Screens.BidLanding}
          options={{
            headerShown: false
          }}
        />
      </AuthenticatedStack.Navigator>

      <DisappearingNotification
        seconds={7}
        message={errorQuery?.data?.message ?? ""}
        isError={true}
        visible={errorQuery?.data !== null && typeof errorQuery?.data !== "undefined"}
        onHide={() => queryClient.setQueryData([QueryKeys.Error], null)}
      />
    </>
  );
};

const LoginNavigator = () => {
  const errorQuery = useGetError()
  return (
    <>
      <LoginStack.Navigator>
        <LoginStack.Screen
          name={Names.GET_STARTED_SCREEN}
          component={Screens.GetStarted}
          options={{
            headerTitle: '',
            headerShown: false,
            headerShadowVisible: false
          }}
        />
        <LoginStack.Screen
          name={Names.REGISTER_NUMBER_SCREEN}
          component={Screens.RegisterNumber}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <LoginStack.Screen
          name={Names.REGISTER_CODE_SCREEN}
          component={Screens.RegisterCode}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <LoginStack.Screen
          name={Names.PRIVACY_POLICY_SCREEN}
          component={Screens.PrivacyPolicy}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <LoginStack.Screen
          name={Names.TERMS_CONDITIONS_SCREEN}
          component={Screens.TermsConditions}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
        <LoginStack.Screen
          name={Names.MSA_SCREEN}
          component={Screens.MSA}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} forceShow={true} />
            )
          }}
        />
      </LoginStack.Navigator>

      <DisappearingNotification
        seconds={7}
        message={errorQuery?.data?.message ?? ""}
        isError={true}
        visible={errorQuery?.data !== null && typeof errorQuery?.data !== "undefined"}
        onHide={() => queryClient.setQueryData([QueryKeys.Error], null)}
      />
    </>
  );
};

const RootNavigator = () => {
  const userQuery: { data: any } = useQuery({
    queryKey: [QueryKeys.User],
    queryFn: () => null,
    enabled: false
  });

  return (
    <RootStack.Navigator
      // initialRouteName={
      //   userQuery.data?.id ? Names.HOME_SCREEN : Names.GET_STARTED_SCREEN
      // }
      screenOptions={{
        headerBackVisible: false,
        headerShadowVisible: false
      }}>
      {userQuery.data?.id ? (
        <RootStack.Screen
          name="Authenticated"
          component={AuthenticatedNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <RootStack.Screen
          name="Login"
          component={LoginNavigator}
          options={{ headerShown: false }}
        />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
