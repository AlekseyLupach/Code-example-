import {useQuery} from '@tanstack/react-query';
import {QueryKeys} from 'src/constants/enums';
import {getProjectMedia} from '../ProjectService';
import useGetActiveProjectId from './useGetActiveProjectId';

const useGetProjectMedia = () => {
  const activeProjectId = useGetActiveProjectId();
  const {data, isPending, isSuccess} = useQuery({
    queryKey: [QueryKeys.progressPhotos, activeProjectId],
    queryFn: async ({signal}) =>
      getProjectMedia(activeProjectId!, true, signal),
    enabled: !!activeProjectId,
  });
  return {data, isPending, isSuccess};
};

export default useGetProjectMedia;
