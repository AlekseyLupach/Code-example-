import {useQuery} from '@tanstack/react-query';
import {QueryKeys} from 'src/constants/enums';

const useGetBranchLink = () => {
  const branchLink = useQuery({
    queryKey: [QueryKeys.branchLink],
    queryFn: () => {},
    enabled: false,
  });

  return branchLink;
};

export default useGetBranchLink;
