import {
  DeepLinkIGoInspectionRequestDto,
  InspectionGoRequestUserInfoDto,
  ReportInfoDto
} from 'src/api/generated';
import { callAPI } from '../BaseAPIService';
import { kandaEndpoints } from '../Endpoints';

export const getIGOProfile = async (
  data: DeepLinkIGoInspectionRequestDto,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.getIGOProfile,
    method: 'post',
    data: data,
    signal
  }) as InspectionGoRequestUserInfoDto;
};

export const checkIGoInspectionId = async (
  data: DeepLinkIGoInspectionRequestDto,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.checkIGoInspectionId,
    method: 'post',
    data: data,
    signal
  }) as ReportInfoDto;
};
