import {callPlatformAPI} from '../BaseAPIService';
import {nativeEndpoints, phaseEndpoints, projectEndpoints} from '../Endpoints';

export const getProjectById = async (
  projectId: number,
  signal?: AbortSignal | undefined,
) => {
  return callPlatformAPI({
    url: `${projectEndpoints.getWithChildren}?id=${projectId}`,
    method: 'get',
    signal,
  });
};

export const getProjectList = async (
  userRegistrationDate: string,
  signal?: AbortSignal | undefined,
) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getProjects}?userRegistrationDate=${userRegistrationDate}`,
    method: 'get',
    signal,
  });
};

export const getMasterSchedules = async (
  projectId: string | number,
  startDate: string | moment.Moment,
  endDate: string | moment.Moment,
  signal?: AbortSignal | undefined,
) => {
  return callPlatformAPI({
    url: `${phaseEndpoints.getMasterSchedules}?projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`,
    method: 'get',
    signal,
  });
};

export const getProjectMedia = async (
  projectId: string | number,
  getPhotosAndVideos: boolean,
  signal?: AbortSignal | undefined,
) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getProjectMedia}?projectId=${projectId}&getPhotosAndVideos=${getPhotosAndVideos}`,
    method: 'get',
    signal,
  });
};

export const getCurbioTeam = async (
  projectId: string | number,
  signal?: AbortSignal | undefined,
) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getCurbioTeam}?projectId=${projectId}`,
    method: 'get',
    signal,
  });
};

export const getJobsWithTasks = async (
  projectId: string | number,
  signal?: AbortSignal | undefined,
) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getJobsWithTasksV2}/${projectId}?includeProjectTasks=true`,
    method: 'get',
    signal,
  });
};

export const getCalendar = async (
  projectId: string | number,
  signal?: AbortSignal | undefined,
) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getCalendar}?projectId=${projectId}`,
    method: 'get',
    signal,
  });
};

export const getPhaseDetails = async (
  projectId: string | number,
  phaseId: string | number,
  signal?: AbortSignal | undefined,
) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getPhaseDetails}?projectId=${projectId}&phaseId=${phaseId}`,
    method: 'get',
    signal,
  });
};

export const getCalendarEventAttendees = async (
  projectId: string | number,
  signal?: AbortSignal | undefined,
) => {
  return callPlatformAPI({
    url: `${nativeEndpoints.getCalendarEventAttendees}?projectId=${projectId}`,
    method: 'get',
    signal,
  });
};
