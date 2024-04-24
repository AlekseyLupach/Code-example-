import {useQuery} from '@tanstack/react-query';
import {UserAccessTokenDto} from 'src/api/generated';
import {QueryKeys} from 'src/constants/enums';

const useGetAuth = () => {
  const {data} = useQuery<UserAccessTokenDto>({
    queryKey: [QueryKeys.auth],
    enabled: false,
  });

  return {...data};
};

export default useGetAuth;
