import { Identify, identify, init } from '@amplitude/analytics-react-native';
import { NavigationContainer } from '@react-navigation/native';
import Instabug from 'instabug-reactnative';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Linking, StatusBar } from 'react-native';
import branch from 'react-native-branch';
import CodePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import { checkNotifications, PERMISSIONS, request } from 'react-native-permissions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-notifications';
import configuration from './configuration';
import { AppVersionDto, UserAccessTokenDto } from './src/api/generated';
import { toastConfig } from './src/components/CustomToast/CustomToast';
import DeviceInfoLogsListener from './src/listeners/DeviceInfoLogsListener/DeviceInfoLogsListener';
import AppStateStatus from './src/listeners/AppStateStatus/AppStateStatus';
import { configutaionApiName, orange, whiteColor } from './src/constants';
import ErrorBoundary from './src/logging/globalErrorHandler';
import Navigation from './src/navigation/navigation';
import { setNavigationRef } from './src/navigation/navigationService';
import { NavigationParamsList } from './src/navigation/types';
import { notificationListener, requestPushNotificationPermission } from './src/notification/notification';
import { AppVersionText } from './src/styled';
import useLogger from './src/Utils/hooks/useLogger';
import { setGlobalToastService } from './src/Utils/toastService';
import { QueryErrorResetBoundary, onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import UpdateAppModal from './src/components/UpdateAppModal/UpdateAppModal';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { persister, queryClient } from './src/services/queryClient';
import { StorageKeys } from './src/constants/storage';
import { getValue, storeValue } from './src/Utils/common';
import { getAppVersion } from './src/services/AuthService';
import ConnectionLostAlert from './src/components/Offline/ConnectionLostAlert/ConnectionLostAlert';
import { QueryKeys } from './src/constants/enums';
import * as Names from './src/constants/routes';
import queryString from 'query-string';

const appVersion = DeviceInfo.getVersion();

const codepushConfig = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
};

const linking = {
  prefixes: ['curbio://'],
  subscribe(listener) {
    // First, you may want to do the default deep link handling
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);

    // Next, you would need to subscribe to incoming links from your third-party integration
    // For example, to get to subscribe to incoming links from branch.io:
    const branchUnsubscribe = branch.subscribe(({ error, params, uri }) => {
      console.log('ON RECEIVE URL', { error, params, uri });

      // if (!params['+non_branch_link']) {
      //   return;
      // }

      if (error) {
        console.error('Error from Branch: ' + error);
        return;
      }

      if (params['+non_branch_link']) {
        // Route non-Branch URL if appropriate.
        return;
      }

      if (!params['+clicked_branch_link']) {
        // Indicates initialization success and some other conditions.
        // No link was opened.
        return;
      }

      // A Branch link was opened
      // attach any query params to deeplink_path
      let url = params.$deeplink_path;
      // Param assignment

      const parsedQuery = queryString.parseUrl(params['~referring_link']);
      console.log("parsedQuery.query", parsedQuery.query)
      if (parsedQuery.query && parsedQuery.query.data) {
        const dataValue = parsedQuery.query.data;
        console.log("dataValue", dataValue)
        url = `${params.$deeplink_path}/${dataValue}`;
      }
      // if (parsedQuery.query) {
      //   console.log("parsedQuery", parsedQuery)
      //   console.log("ASD", `${params.$deeplink_path}/${parsedQuery.query}`)
      //   url = `${params.$deeplink_path}/${parsedQuery.query}`;
      // }

      // Persist Branch Link Across Login/Register Event
      const auth = queryClient.getQueryData([QueryKeys.auth]) as UserAccessTokenDto;

      if (!auth?.accessToken) {
        console.log("set QueryKeys.branchLink")
        queryClient.setQueryData([QueryKeys.branchLink], uri);
        return;
      }

      console.log('DEEPLINK PATH', url);
      listener(url);
    });

    return () => {
      // Clean up the event listeners
      Linking.removeAllListeners('url');
      branchUnsubscribe();
    };
  },
  config: {
    screens: {
      // Authenticated Stack
      AUTHENTICATED: {
        screens: {
          [Names.HOME_SCREEN]: {
            screens: {
              Home: 'inspector/:inspectorCompanyCode',
            }
          },
          [Names.SPLASH_PARTNER_SCREEN]: 'partner-splash/:partnerCode',
          [Names.INSPECTION_REPORT_WAIT_SCREEN]:
            'igo-quote/:iGoInspectionProcessingRequestId',
          [Names.PUNCH_REPORT_SCREEN]: 'inspection/:linkParams', // can be "reportRequestId" or "linkCode"
          [Names.RENOVATION_ESTIMATE]: 'estimate/:linkParams', // can be "reportRequestId" or "linkCode"
        },
      },
      // Un-authenticated Stacks
      LOGIN: {
        screens: {},
      },
    },
  },
};

const App = () => {
  const [showUpdateAppModal, setShotUpdateAppModal] = useState<boolean>(false);
  const { logger } = useLogger();

  useEffect(() => {
    appInitialization();
    onlineManager.setEventListener(setOnline => {
      return NetInfo.addEventListener(state => {
        setOnline(!!state.isConnected);
      });
    });
  }, []);

  const appInitialization = async () => {
    moment.tz.setDefault('America/New_York');
    let AccountProfileEmail = await getValue(StorageKeys.accountProfileEmail);
    let isFirstLaunch = await getValue(StorageKeys.isFirstLaunch);
    init(configuration.AMPLITUDE_API_KEY, AccountProfileEmail!, {
      trackingOptions: {
        appSetId: true,
        idfv: true,
      },
    });
    branch.subscribe(({ error, params, uri }) => {
      console.log("branch.subscribe", params)
      const identifyObj = new Identify();
      identifyObj.set('utm_campaign', params?.['~campaign']!);
      identifyObj.set('utm_source', params?.['~channel']!);
      identifyObj.set('utm_medium', params?.['~feature']!);
      identify(identifyObj);
    });
    await handleGetAppVersion();
    await notificationListener();
    Instabug.start(configuration.INSTABUG_KEY, []);
    Instabug.setPrimaryColor(orange);
    Instabug.setTrackUserSteps(true);
    Instabug.setSessionProfilerEnabled(true);
    Instabug.setWelcomeMessageMode(Instabug.welcomeMessageMode.disabled);

    SplashScreen.hide();
    logger.trackEvent({ name: 'splash - screen hiding' });
    await getPermissions();
    logger.trackEvent({ name: 'application open' });
    if (isFirstLaunch !== 'false') {
      logger.trackEvent({ name: 'application first open' });
      logger.branchEvent('Download', {});
      await storeValue(StorageKeys.isFirstLaunch, 'false');
    }
  };

  const getPermissions = async () => {
    await requestPushNotificationPermission();
    await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then(status => {
      const identifyObj = new Identify();
      identifyObj.set('c_userTracking', status);
      identify(identifyObj);
    });
    await checkNotifications().then(({ status }) => {
      const identifyObj = new Identify();
      identifyObj.set('c_pushNotification', status);
      identify(identifyObj);
    });
  };

  const handleGetAppVersion = async () => {
    const result = await getAppVersion();
    const versionСheck = result.supportedVersions.find(
      (item: AppVersionDto) => item.version === appVersion,
    );
    if (result.supportedVersions) {
      if (versionСheck) return;
      setShotUpdateAppModal(true);
      logger.trackEvent({ name: 'deprecated version popup view' });
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{ persister }}>
              <NavigationContainer<NavigationParamsList>
                ref={el => setNavigationRef(el!)}
                linking={linking as any}
              >
                {showUpdateAppModal ? <UpdateAppModal onClose={() => setShotUpdateAppModal(false)} /> : null}
                <Navigation />
                {configuration.API_NAME !=
                  configutaionApiName.production && (
                    <AppVersionText style={{ bottom: 20 }}>
                      {configuration.API_NAME}
                      {appVersion}
                    </AppVersionText>
                  )}
                <AppStateStatus />
                <DeviceInfoLogsListener />
              </NavigationContainer>
              <ConnectionLostAlert />
            </PersistQueryClientProvider>
          )}
        </QueryErrorResetBoundary>
      </SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} backgroundColor={whiteColor} />
      <Toast
        renderType={toastConfig}
        ref={el => setGlobalToastService(el!)}
      />
    </ErrorBoundary>
  );
};

// export default CodePush(codepushConfig)(App);
export default App;
