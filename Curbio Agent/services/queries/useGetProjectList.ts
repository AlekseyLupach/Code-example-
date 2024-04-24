import {Identify, identify} from '@amplitude/analytics-react-native';
import {useQuery} from '@tanstack/react-query';
import {QueryKeys} from 'src/constants/enums';
import {getProjectList} from '../ProjectService';
import {queryClient} from '../queryClient';
import useAccountProfile from './useAccountProfile';
import useGetAuth from './useGetAuth';

const useGetProjectList = () => {
  const identifyObj = new Identify();
  const {getProfile} = useAccountProfile();
  const profile = getProfile().data;
  const auth = useGetAuth();
  const initialProjectQuery = useQuery({
    queryKey: [QueryKeys.activeProjectId],
  }).data as any[];

  const {isPending, data, isSuccess} = useQuery({
    queryKey: [QueryKeys.projectsList],
    queryFn: async ({signal}) =>
      getProjectList(profile?.registrationDate!, signal),
    enabled: !!profile?.registrationDate && !!auth.userGuid,
    staleTime: 24 * 60 * 60 * 1000, //24h,
  });

  if (isSuccess && initialProjectQuery === undefined && data.length > 0) {
    queryClient.setQueryData([QueryKeys.activeProjectId], data[0]?.id);
    identifyObj.set(
      'c_isplatform',
      data?.length && data.payload?.length > 0 ? true : false,
    );
    identify(identifyObj);
  } else {
    identifyObj.set('c_isplatform', false);
    identify(identifyObj);
  }

  return {data, isPending, isSuccess};
};

export default useGetProjectList;
