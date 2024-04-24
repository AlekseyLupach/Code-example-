import DeviceInfo from 'react-native-device-info';
import {
  CompleteRegistrationCommand,
  ExternalAuthenticationCommand,
  LoginUserCommand,
  LoginUsingBiometricSignatureCommand,
  RefreshTokenUserCommand,
  RegisterUserUsingEmailAndPasswordV2Command,
} from 'src/api/generated';
import {callAPI} from '../BaseAPIService';
import {kandaEndpoints} from '../Endpoints';

export const getAppVersion = async () => {
  return callAPI({
    url: kandaEndpoints.getAppVersion,
    method: 'get',
  });
};

export const registrationViaEmail = async (
  data: RegisterUserUsingEmailAndPasswordV2Command,
  signal?: AbortSignal | undefined,
) => {
  return callAPI({
    url: kandaEndpoints.registrationViaEmail,
    method: 'post',
    data: data,
    signal,
  });
};

export const loginViaBiometric = async (
  data: LoginUsingBiometricSignatureCommand,
  signal?: AbortSignal | undefined,
) => {
  return callAPI({
    url: kandaEndpoints.loginViaBiometric,
    method: 'post',
    data: {...data, appVersion: DeviceInfo.getVersion()},
    signal,
  });
};

export const loginViaEmail = async (
  data: LoginUserCommand,
  signal?: AbortSignal | undefined,
) => {
  return callAPI({
    url: kandaEndpoints.loginViaEmail,
    method: 'post',
    data: {...data, appVersion: DeviceInfo.getVersion()},
    signal,
  });
};

export const refreshToken = async (
  data: RefreshTokenUserCommand,
  signal?: AbortSignal | undefined,
) => {
  return callAPI({
    url: kandaEndpoints.refreshToken,
    method: 'post',
    data: {...data, appVersion: DeviceInfo.getVersion()},
    signal,
  });
};

export const loginExternal = async (
  data: ExternalAuthenticationCommand,
  signal?: AbortSignal | undefined,
) => {
  return callAPI({
    url: kandaEndpoints.loginExternal,
    method: 'post',
    data: {...data, appVersion: DeviceInfo.getVersion()},
    signal,
  });
};

export const completeRegistration = async (
  data: CompleteRegistrationCommand,
  signal?: AbortSignal | undefined,
) => {
  return callAPI({
    url: kandaEndpoints.completeRegistration,
    method: 'post',
    data: data,
    signal,
  });
};
