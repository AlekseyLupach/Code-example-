import {
  CreateIRShareLinkRequestDto,
  CreateReportShareRequestDto,
  RecommendMeAPartnerAgentForReportCommand,
  ReportApiApiReportCheckReportStatusGetRequest,
  ReportApiApiReportRequestRepairsV2GetRequest,
  ReportStatusDto,
  RequestProposalCommand,
  SaveAddonCommand,
  SaveSelectionsV2Command,
  ShareInspectionReportLinkInfoDto,
  ShareInspectionReportLinkResultDto,
  ShareLinkApiApiShareLinkCheckInspectionReportShareLinkV2GetRequest
} from 'src/api/generated';
import { callAPI } from '../BaseAPIService';
import { kandaEndpoints } from '../Endpoints';

export const getInspectionRepairsReport = async (
  params: ReportApiApiReportRequestRepairsV2GetRequest,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.getInspectionRepairsReport,
    method: 'get',
    params: params,
    signal
  });
};

export const updateAddon = async (data: SaveAddonCommand) => {
  return callAPI({
    url: kandaEndpoints.updateAddon,
    method: 'post',
    data: data
  });
};

export const updateSelections = async (data: SaveSelectionsV2Command) => {
  return callAPI({
    url: kandaEndpoints.updateSelections,
    method: 'post',
    data: data
  });
};

export const shareInspectionRepairsReport = async (
  data: CreateReportShareRequestDto
) => {
  return callAPI({
    url: kandaEndpoints.shareInspectionRepairsReport,
    method: 'post',
    data: data
  });
};

export const recommendPartnerInspectionRepairsReport = async (
  data: RecommendMeAPartnerAgentForReportCommand
) => {
  return callAPI({
    url: kandaEndpoints.shareInspectionRepairsReport,
    method: 'post',
    data: data
  });
};

export const requestProposalInspectionRepairsReport = async (
  data: RequestProposalCommand
) => {
  return callAPI({
    url: kandaEndpoints.requestProposalInspectionRepairsReport,
    method: 'post',
    data: data
  });
};

export const checkInspectionRepairsStatus = async (
  params: ReportApiApiReportCheckReportStatusGetRequest
) => {
  return callAPI({
    url: kandaEndpoints.checkInspectionRepairsStatus,
    method: 'get',
    params: params
  }) as ReportStatusDto;
};

export const checkShareInspectionRepairsStatus = async (
  params: ShareLinkApiApiShareLinkCheckInspectionReportShareLinkV2GetRequest
) => {
  return callAPI({
    url: kandaEndpoints.checkShareInspectionRepairsStatus,
    method: 'get',
    params: params
  }) as ShareInspectionReportLinkInfoDto;
};

export const createShareInspectionRepairsLink = async (
  data: CreateIRShareLinkRequestDto
) => {
  return callAPI({
    url: kandaEndpoints.createShareInspectionRepairsLink,
    method: 'post',
    data: data
  }) as ShareInspectionReportLinkResultDto;
};
