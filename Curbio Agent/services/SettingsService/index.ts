import {ToSAndPrivacyLinksDto} from 'src/api/generated';
import {callAPI} from '../BaseAPIService';
import {kandaEndpoints} from '../Endpoints';

export const getPrivacyPolicyAndTermsOfServiceWebLinks = async (
  signal?: AbortSignal | undefined,
): Promise<ToSAndPrivacyLinksDto> => {
  return callAPI({
    url: kandaEndpoints.getPrivacyPolicyAndTermsOfServiceWebLinks,
    method: 'get',
    signal: signal,
  }) as Promise<ToSAndPrivacyLinksDto>;
};
