import { callPlatformAPI } from '../BaseAPIService';
import { nativeEndpoints } from '../Endpoints';

export const getInboxProjectPosts = async (
  params: { projectId: string | number; page: number; rowsPerPage: number },
  signal?: AbortSignal | undefined
) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getInboxProjectPosts}?projectId=${params.projectId}&page=${params.page}&rowsPerPage=${params.rowsPerPage}`,
    method: 'get',
    signal
  });
};

export const createInboxProjectPost = async (params: {
  projectId: string | number;
  activityText: string;
  requestBlobs: string[];
}) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.createInboxProjectPost}?projectId=${params.projectId}&activityText=${params.activityText}`,
    method: 'post',
    data: params.requestBlobs,
    hideToast: true
  });
};
