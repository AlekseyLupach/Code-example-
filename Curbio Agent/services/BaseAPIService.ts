import NetInfo from '@react-native-community/netinfo';
import { AxiosError } from 'axios';
import { UserAccessTokenDto } from 'src/api/generated';
import { QueryKeys } from 'src/constants/enums';
import logger from 'src/logging/applicationInsights';
import { logout } from 'src/screens/SettingsScreen/SettingsScreen';
import { toastService } from 'src/Utils/toastService';
import { getErrors } from 'src/Utils/utils';
import { refreshToken } from './AuthService';
import { axiosPlatformWithCred, axiosWithCred } from './Interceptor';
import { queryClient } from './queryClient';

interface APICallOptions {
  url: string;
  method: string;
  params?: Object | undefined;
  data?: Object;
  signal?: AbortSignal | undefined;
  hideToast?: boolean;
}

export interface ErrorData {
  status: number;
  message: string;
  isCurbioError: boolean;
  errorMessage: string | undefined;
}

let globalRefreshPromise: any = null;

const isOnline = async (): Promise<boolean | null> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected;
};

export const callAPI = async (options: APICallOptions) => {
  if (await isOnline()) {
    try {
      const requestConfig = {
        url: options.url,
        method: options.method ?? 'get',
        params: options.params,
        data: options.data ? options.data : undefined,
        signal: options.signal
      };

      console.log('[ Request Made ]:', requestConfig);

      const result = await axiosWithCred(requestConfig);
      return result.data;
    } catch (err) {
      if (!options.hideToast) {
        toastService.toastError(
          err,
          getErrors(err)
            .map((e) => e.message)
            .toString()
        );
      }
      console.log('[ Request Error ]:', JSON.stringify(err));
      const readableError = err as AxiosError;
      let errorMessage = '';
      getErrors(readableError).forEach((e) => (errorMessage = e.message));

      if (readableError.response?.status == 401) {
        const auth = queryClient.getQueryData([
          QueryKeys.auth
        ]) as UserAccessTokenDto;
        if ((readableError.config as any).alreadyTriedToRefresh) {
          console.log('ALREADY TRIED TO REFRESH TOKEN. Logging out.');
          logger.trackEvent({
            name: 'ALREADY TRIED TO REFRESH TOKEN. Logging out.',
            properties: {
              email: auth?.userEmail
            }
          });
          logout();
          return Promise.reject();
        }

        globalRefreshPromise =
          globalRefreshPromise ||
          refreshToken({
            accessToken: auth?.accessToken!,
            refreshToken: auth?.refreshToken!
          })
            .then(async (result) => {
              queryClient.setQueryData([QueryKeys.auth], {
                ...auth,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
              });
              globalRefreshPromise = null;
              return result.accessToken;
            })
            .catch(() => {
              logger.trackEvent({
                name: 'CATCH FAILED TO REFRESH TOKEN. Logging out.',
                properties: {
                  email: auth?.userEmail
                }
              });
              logout();
              return null;
            });
        return globalRefreshPromise.then(async (accessToken: any) => {
          if (accessToken != null) {
            readableError.config!.headers!.Authorization = `Bearer ${accessToken}`;
            (readableError.config as any).alreadyTriedToRefresh = true;
            const result = await axiosWithCred(readableError.config!);
            return result.data;
          } else {
            return Promise.reject(readableError);
          }
        });
      }
    }
  }
};

export const callPlatformAPI = async (options: APICallOptions) => {
  if (await isOnline()) {
    try {
      const requestConfig = {
        url: `/${options.url}`,
        method: options.method ?? 'get',
        data: options.data,
        signal: options.signal
      };

      console.log('[ Request Made ]:', requestConfig);

      const result = await axiosPlatformWithCred(requestConfig);
      return result.data;
    } catch (err) {
      if (!options.hideToast) {
        toastService.toastError(
          err,
          getErrors(err)
            .map((e) => e.message)
            .toString()
        );
      }
      console.log('[ Request Error ]:', err);
      const readableError = err as AxiosError;
      let errorMessage = '';
      getErrors(readableError).forEach((e) => (errorMessage = e.message));

      if (readableError.response) {
        const errorData: ErrorData = {
          errorMessage: errorMessage,
          status: readableError.response.status,
          message:
            readableError.response.data?.message ??
            'Encountered an error. Please try again!',
          isCurbioError: readableError.response.data?.isCurbioError ?? false
        };
        throw {
          status: readableError.response.status,
          data: errorData
        };
      } else {
        throw {
          status: 400,
          data: {
            message: 'Encountered an error. Please try again!'
          }
        };
      }
    }
  }
};
