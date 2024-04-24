import {
  RennovationEstimatesApiApiRennovationEstimatesDeleteEstimateDeleteRequest,
  RennovationEstimatesApiApiRennovationEstimatesGetEstimatesPageGetRequest,
} from 'src/api/generated';
import {callAPI} from '../BaseAPIService';
import {kandaEndpoints} from '../Endpoints';

export const getEstimatesList = async (
  params: RennovationEstimatesApiApiRennovationEstimatesGetEstimatesPageGetRequest,
) => {
  let url = `${kandaEndpoints.getEstimatesList}?`;
  let renovationEstimateStatuses = params.renovationEstimateStatuses;
  if (renovationEstimateStatuses && renovationEstimateStatuses.length > 0) {
    renovationEstimateStatuses?.forEach(id => {
      url += `renovationEstimateStatuses=${id}&`;
    });
  }
  if (params.addressFilter) {
    url += `addressFilter=${params.addressFilter}&`;
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
  return callAPI({
    url: url,
    method: 'get',
  });
};

export const delEstimatesListItem = async (
  params: RennovationEstimatesApiApiRennovationEstimatesDeleteEstimateDeleteRequest,
) => {
  return callAPI({
    url: kandaEndpoints.delEstimatesListItem,
    method: 'DELETE',
    params: params,
  });
};
