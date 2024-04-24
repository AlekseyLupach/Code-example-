import axios from 'axios';
import configuration from 'configuration';

export const $api = axios.create({
  withCredentials: true,
  timeout: 1000 * 90,
  baseURL: configuration.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const $nonCredentialApi = axios.create({
  timeout: 1000 * 90,
});

export const $curbioMainApi = axios.create({
  withCredentials: false,
  timeout: 1000 * 90,
});
