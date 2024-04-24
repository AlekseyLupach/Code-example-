import {DocumentPickerResponse} from 'react-native-document-picker';
import {
  ReportApiApiReportIfZipIsSupportedGetRequest,
  ReportApiApiReportV2RequestPostRequest,
} from 'src/api/generated';
import {callAPI} from '../BaseAPIService';
import {kandaEndpoints} from '../Endpoints';

interface IPreloadInspection {
  file:
    | {
        uri: string;
        type: string | null;
        name: string;
      }
    | DocumentPickerResponse
    | null;
}

export const checkFileSize = async (data: any) => {
  return callAPI({
    url: kandaEndpoints.checkFileSize,
    method: 'get',
  });
};

export const checkZipCode = async (
  params: ReportApiApiReportIfZipIsSupportedGetRequest,
) => {
  return callAPI({
    url: kandaEndpoints.checkZipCode,
    method: 'get',
    params: params,
  });
};

export const preloadInspectionReport = async (data: IPreloadInspection) => {
  return callAPI({
    url: kandaEndpoints.preloadInspectionReport,
    method: 'post',
    data: data,
  });
};

export const uploadingInspectionReport = async (
  // data: IPreloadInspection & IUploadForm,
  data: ReportApiApiReportV2RequestPostRequest,
) => {
  return callAPI({
    url: kandaEndpoints.preloadInspectionReport,
    method: 'post',
    data: data,
  });
};
