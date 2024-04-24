import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';
import { theme } from './src/config/theme';
import SplashScreen from 'react-native-splash-screen';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { persister, queryClient } from './src/services/queryClient';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager, QueryErrorResetBoundary } from '@tanstack/react-query';
import ErrorBoundary from './src/components/Alerts/ErrorBoundary/ErrorBoundary';
import { ActivityIndicator, Linking, View } from 'react-native';
import branch from 'react-native-branch';
import RootNavigator from './src/navigation/RootNavigator';
import CodePush from 'react-native-code-push';
import { nicelog } from './src/utils/nicelog';
import { navigationRef } from '.';
import EnvFlag from './src/components/Common/EnvFlag/EnvFlag';
import { DevToolProvider } from './src/hooks/useDev';
import {
  Identify,
  identify,
  init,
  track
} from '@amplitude/analytics-react-native';
import { AMPLITUDE_API_KEY } from '@env';
import { StorageKeys } from './src/constants/storage';
import { getValue, storeValue } from './src/utils/common';
import {
  AmplitudeEvents,
  AmplitudeUserProperties
} from './src/constants/enums';
import * as Names from './src/constants/screens';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import OfflineIndicator from './src/components/Alerts/OfflineIndicator/OfflineIndicator';

const codepushConfig = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE
};

const linking = {
  prefixes: ['native-contractor://'],
  subscribe(listener) {
    // First, you may want to do the default deep link handling
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);

    // Next, you would need to subscribe to incoming links from your third-party integration
    // For example, to get to subscribe to incoming links from branch.io:
    const branchUnsubscribe = branch.subscribe(({ error, params, uri }) => {
      nicelog('ON RECEIVE URL', { error, params, uri });

      if (error) {
        console.error('Error from Branch: ' + error);
        return;
      }

      if (params['+non_branch_link']) {
        const nonBranchUrl = params['+non_branch_link'];
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

      if (params?.data && params?.projectJobId) {
        url = `${params.$deeplink_path}/${params.data}/${params.projectJobId}`;
      } else if (params?.data) {
        url = `${params.$deeplink_path}/${params.data}`;
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
      Authenticated: {
        screens: {
          [Names.HOME_NAVIGATOR]: {
            screens: {
              Projects: 'projects',
              Account: 'account'
            }
          },
          [Names.CREW_APPROVAL_SCREEN]: 'approval/:projectId?',
          [Names.PROJECTS_LISTS_SCREEN]: 'jobs/:projectJobId',
          [Names.JOB_DETAILS_SCREEN]: 'job/:projectJobId',
          [Names.BIDS_SCREEN]: 'bids/:projectJobId',
          [Names.BID_DETAILS_SCREEN]: 'bid/:projectJobId',
          [Names.SCOPE_OF_WORK_SCREEN]: 'scope/:projectJobId',
          [Names.PAYMENTS_SCREEN]: 'payments/:projectJobId'
        }
      },
      // Un-authenticated Stacks
      Login: {
        screens: {
          'Register Number': 'register',
          'Register Code': 'code'
        }
      }
    }
  }
};

const amplitudeInit = async () => {
  const guid = (await getValue(StorageKeys.guid)) || '';
  const isInitialLaunch =
    (await getValue(StorageKeys.isInitialLaunch)) || 'true';
  init(AMPLITUDE_API_KEY, guid, {
    trackingOptions: {
      appSetId: true,
      idfv: true
    }
  });
  const identifyObj = new Identify();
  guid && identifyObj.set(AmplitudeUserProperties.Guid, guid);
  PushNotification.checkPermissions(({ alert, badge, sound }) => {
    identifyObj.set(AmplitudeUserProperties.PushPermissionAlert, !!alert);
    identifyObj.set(AmplitudeUserProperties.PushPermissionBadge, !!badge);
    identifyObj.set(AmplitudeUserProperties.PushPermissionSound, !!sound);
  });
  identifyObj.set(AmplitudeUserProperties.AppVersion, DeviceInfo.getVersion());
  identify(identifyObj);
  if (isInitialLaunch === 'true') {
    track(AmplitudeEvents.AppFirstOpen);
    await storeValue(StorageKeys.isInitialLaunch, 'false');
  }
  track(AmplitudeEvents.AppOpen);
};

function App(): JSX.Element {
  useEffect(() => {
    SplashScreen.hide();

    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      });
    });

    amplitudeInit();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <DevToolProvider>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset}>
              <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{
                  persister,
                  maxAge: Infinity
                }}
                onSuccess={() => {
                  // resume mutations after initial restore from localStorage was successful
                  queryClient.resumePausedMutations().then(() => {
                    queryClient.invalidateQueries();
                  });
                }}>
                <NavigationContainer
                  ref={navigationRef}
                  linking={linking}
                  fallback={
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                      <ActivityIndicator animating={true} />
                    </View>
                  }>
                  <RootNavigator />
                </NavigationContainer>
                <EnvFlag />
                <OfflineIndicator />
              </PersistQueryClientProvider>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </DevToolProvider>
    </ThemeProvider>
  );
}

export default CodePush(codepushConfig)(App);
