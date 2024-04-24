import axios from 'axios';
import configuration from 'configuration';
import {UserAccessTokenDto} from 'src/api/generated';
import {QueryKeys} from 'src/constants/enums';
import {queryClient} from './queryClient';

const instanceWithCred = axios.create({
  withCredentials: true,
  timeout: 1000 * 30,
  baseURL: configuration.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const instanceWithoutCred = axios.create({
  timeout: 1000 * 30,
  baseURL: configuration.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instanceWithCred.interceptors.request.use(
  async config => {
    const auth = queryClient.getQueryData([
      QueryKeys.auth,
    ]) as UserAccessTokenDto;
    config.headers!.Authorization = `Bearer ${auth?.accessToken}`;
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

const instancePlatformWithCred = axios.create({
  withCredentials: false,
  timeout: 1000 * 30,
  baseURL: configuration.CURBIO_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instancePlatformWithCred.interceptors.request.use(
  async config => {
    const auth = queryClient.getQueryData([
      QueryKeys.auth,
    ]) as UserAccessTokenDto;

    if (!config.headers?.Authorization) {
      config!.headers = {cookie: `userGuid=${auth?.userGuid}`} as any;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

// TODO: How to handle expired cookies?

export const axiosWithCred = instanceWithCred;
export const axiosWithoutCred = instanceWithoutCred;
export const axiosPlatformWithCred = instancePlatformWithCred;
