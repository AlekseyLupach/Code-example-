import {useQuery} from '@tanstack/react-query';
import {QueryKeys} from 'src/constants/enums';

const useGetActiveProjectId = () => {
  const {data} = useQuery({
    queryKey: [QueryKeys.activeProjectId],
  });
  return data as number | undefined;
};

export default useGetActiveProjectId;
