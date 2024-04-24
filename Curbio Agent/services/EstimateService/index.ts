import {
  CreateREShareLinkRequestDto,
  EstimateBaseInfo,
  GeneralEstimateItemApiApiGeneralEstimateItemGetRequest,
  RecommendMeAPartnerAgentForEstimateCommand,
  RennovationEstimatesApiApiRennovationEstimatesCheckEstimateGetRequest,
  RennovationEstimatesApiApiRennovationEstimatesGetAddressGetRequest,
  RennovationEstimatesApiApiRennovationEstimatesGetBeforePdfInfoGetRequest,
  RennovationEstimatesApiApiRennovationEstimatesGetProposalV2PostRequest,
  RennovationEstimatesApiApiRennovationEstimatesGetSavedEstimateGetRequest,
  SavePdfInfoCommand,
  SaveRennovationEstimateCommand,
  ShareLinkApiApiShareLinkCheckRenovationEstimateShareLinkV2GetRequest,
  ShareRenovationEstimateLinkInfoDto,
  ShareRenovationEstimateLinkResultDto
} from 'src/api/generated';
import { callAPI, callPlatformAPI } from '../BaseAPIService';
import { kandaEndpoints, nativeEndpoints } from '../Endpoints';

export const getModifiersPrice = async (signal?: AbortSignal | undefined) => {
  return callAPI({
    url: kandaEndpoints.getModifiersPrice,
    method: 'get',
    signal
  });
};

export const getEstimateById = async (
  params: RennovationEstimatesApiApiRennovationEstimatesGetSavedEstimateGetRequest,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.getEstimateById,
    method: 'get',
    params: params,
    signal
  });
};

export const updateEstimateModel = async (
  data: SaveRennovationEstimateCommand,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.updateEstimateModel,
    method: 'post',
    data: data,
    signal
  });
};

export const getEstimateAddressInfo = async (
  params: RennovationEstimatesApiApiRennovationEstimatesGetAddressGetRequest,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.getEstimateAddressInfo,
    method: 'get',
    params: params,
    signal
  });
};

export const getPdfEstimateInfo = async (
  params: RennovationEstimatesApiApiRennovationEstimatesGetBeforePdfInfoGetRequest,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.getPdfEstimateInfo,
    method: 'get',
    params: params,
    signal
  });
};

export const updatePdfEstimateInfo = async (data: SavePdfInfoCommand) => {
  return callAPI({
    url: kandaEndpoints.updatePdfEstimateInfo,
    method: 'post',
    data: data
  });
};

export const getEstimateTreeItems = async (
  params: GeneralEstimateItemApiApiGeneralEstimateItemGetRequest
) => {
  return callAPI({
    url: kandaEndpoints.getEstimateTreeItems,
    method: 'get',
    params: params
  });
};

export const requestEstimateProposal = async (
  data: RennovationEstimatesApiApiRennovationEstimatesGetProposalV2PostRequest
) => {
  return callAPI({
    url: kandaEndpoints.requestEstimateProposal,
    method: 'post',
    params: data
  });
};

export const requestEstimateProposalRecommendPartner = async (
  data: RecommendMeAPartnerAgentForEstimateCommand
) => {
  return callAPI({
    url: kandaEndpoints.requestEstimateProposalRecommendPartner,
    method: 'post',
    data: data
  });
};

export const getEstimateCallNowNumber = async (estimateId: number) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getEstimateCallNowNumber}?roundRobinTypeId=5&estimateId=${estimateId}`,
    method: 'get'
  });
};

export const getEstimateHicRealTimeAvailability = async ({}) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getEstimateHicRealTimeAvailability}`,
    method: 'get',
    hideToast: true
  });
};

export const getEstimateCalendlyUrlV2 = async (estimateId: number) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getEstimateCalendlyUrlV2}?roundRobinTypeId=6&estimateId=${estimateId}`,
    method: 'get'
  });
};

export const checkEstimateStatus = async (
  params: RennovationEstimatesApiApiRennovationEstimatesCheckEstimateGetRequest
) => {
  return callAPI({
    url: kandaEndpoints.checkEstimateStatus,
    method: 'get',
    params: params
  }) as EstimateBaseInfo;
};

export const checkShareEstimateStatus = async (
  params: ShareLinkApiApiShareLinkCheckRenovationEstimateShareLinkV2GetRequest
) => {
  return callAPI({
    url: kandaEndpoints.checkShareEstimateStatus,
    method: 'get',
    params: params
  }) as ShareRenovationEstimateLinkInfoDto;
};

export const createShareEstimateLink = async (
  data: CreateREShareLinkRequestDto
) => {
  return callAPI({
    url: kandaEndpoints.createShareEstimateLink,
    method: 'post',
    data: data
  }) as ShareRenovationEstimateLinkResultDto;
};
