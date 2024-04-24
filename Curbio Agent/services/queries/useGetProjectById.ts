import {useQuery} from '@tanstack/react-query';
import {QueryKeys} from 'src/constants/enums';
import {IProjectByIdData} from '../ProjectService/types';
import useGetActiveProjectId from './useGetActiveProjectId';

const useGetProjectById = () => {
  const activeProjectId = useGetActiveProjectId();
  const {data} = useQuery<IProjectByIdData>({
    queryKey: [QueryKeys.projectById, activeProjectId],
  });
  return {data, activeProjectId};
};

export default useGetProjectById;
