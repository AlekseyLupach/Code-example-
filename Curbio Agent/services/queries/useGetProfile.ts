import {useQuery} from '@tanstack/react-query';
import {UserProfileDto} from 'src/api/generated';
import {QueryKeys} from 'src/constants/enums';

const useGetProfile = () => {
  const {data} = useQuery<UserProfileDto>({
    queryKey: [QueryKeys.profile],
    // queryFn: () => null,
  });

  return data as UserProfileDto;
};

export default useGetProfile;
