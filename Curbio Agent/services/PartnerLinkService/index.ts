import {
  LinkPartnerToUserCommand,
  PartnerApiApiPartnerIsPartnerActiveGetRequest,
  PartnerApiApiPartnerPartnerInfoGetRequest
} from 'src/api/generated';
import { callAPI } from '../BaseAPIService';
import { kandaEndpoints } from '../Endpoints';

export const partnerLinkIsActive = async (
  data: PartnerApiApiPartnerIsPartnerActiveGetRequest,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.partnerLinkIsActive,
    method: 'get',
    params: data,
    signal
  });
};

export const getPartnerLinkInfo = async (
  data: PartnerApiApiPartnerPartnerInfoGetRequest,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.getPartnerLinkInfo,
    method: 'get',
    params: data,
    signal
  });
};

export const updatePartnerLink = async (
  data: LinkPartnerToUserCommand,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.updatePartnerLink,
    method: 'post',
    data: data,
    signal,
    hideToast: true
  });
};
