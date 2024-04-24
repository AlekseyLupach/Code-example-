import {callAPI} from '../BaseAPIService';
import {kandaEndpoints} from '../Endpoints';

export const getHomeScreenContent = async (
  signal?: AbortSignal | undefined,
) => {
  return callAPI({
    url: kandaEndpoints.getHomeContent,
    method: 'get',
    signal,
  });
};

export const getHomeReсentActivities = async (signal?: AbortSignal | undefined) => {
  return callAPI({
    url: kandaEndpoints.getHomeReсentActivities,
    method: 'get',
    signal,
  });
};

export const getHomeSupportedFeatures = async (signal?: AbortSignal | undefined) => {
    return callAPI({
      url: kandaEndpoints.getHomeSupportedFeatures,
      method: 'get',
      signal,
    });
};
