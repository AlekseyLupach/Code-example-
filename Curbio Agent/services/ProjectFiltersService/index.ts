import {callAPI} from '../BaseAPIService';
import {kandaEndpoints} from '../Endpoints';

export const getPunchReportsUserStatuses = async (
  data: {},
  signal?: AbortSignal | undefined,
) => {
  return callAPI({
    url: kandaEndpoints.getPunchReportsUserStatuses,
    method: 'get',
    data: data,
    signal,
  });
};

export const getRenovationEstimatesUserStatuses = async (
  data: {},
  signal?: AbortSignal | undefined,
) => {
  return callAPI({
    url: kandaEndpoints.getRenovationEstimatesUserStatuses,
    method: 'get',
    data: data,
    signal,
  });
};
