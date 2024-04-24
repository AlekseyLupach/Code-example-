import {ReportApiApiReportSubmittedFilesGetRequest} from 'src/api/generated';
import {callAPI} from '../BaseAPIService';
import {kandaEndpoints} from '../Endpoints';

export const getInspectionRepairsList = async (
  params: ReportApiApiReportSubmittedFilesGetRequest,
) => {
  let url = `${kandaEndpoints.getInspectionRepairsList}?`;
  let requestedReportStatuses = params.requestedReportStatuses;
  requestedReportStatuses?.forEach(id => {
    url += `requestedReportStatuses=${id}&`;
  });
  if (params.address) {
    url += `addressFilter=${params.address}&`;
  }
  if (params.pageNumber) {
    url += `pageNumber=${params.pageNumber}&`;
  }
  if (params.pageSize) {
    url += `pageSize=${params.pageSize}&`;
  }
  if (params.createdDateFrom) {
    url += `createdDateFrom=${params.createdDateFrom}&`;
  }
  if (params.createdDateTo) {
    url += `createdDateTo=${params.createdDateTo}&`;
  }
  url = url.slice(0, -1);
  return callAPI({
    url: url,
    method: 'get',
  });
};
