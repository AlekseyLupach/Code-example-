import {CreateSupportRequestCommand} from 'src/api/generated';
import {callAPI} from '../BaseAPIService';
import {kandaEndpoints} from '../Endpoints';

export const submitSupportMessage = async (
  data: CreateSupportRequestCommand,
) => {
  return callAPI({
    url: kandaEndpoints.submitSupportMessage,
    method: 'post',
    data: data,
  });
};
