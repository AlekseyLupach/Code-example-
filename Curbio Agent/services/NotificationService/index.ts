import {CreateOrUpdatePnConfigCommand} from 'src/api/generated';
import {callAPI} from '../BaseAPIService';
import {kandaEndpoints} from '../Endpoints';

export const updatePushNotificationToken = async (
  data: CreateOrUpdatePnConfigCommand,
) => {
  return callAPI({
    url: kandaEndpoints.updatePushNotificationToken,
    method: 'post',
    data: data,
  });
};
