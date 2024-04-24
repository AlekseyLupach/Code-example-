import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QueryKeys} from 'src/constants/enums';
import {
  getAccountProfile,
  updateAccountProfile,
  updateAccountProfileRole,
} from '../ProfileService';

const useAccountProfile = () => {
  const client = useQueryClient();
  const getProfile = () => {
    const getQuery = useQuery({
      queryKey: [QueryKeys.profile],
      queryFn: async ({signal}) => getAccountProfile(signal),
      staleTime: Infinity,
    });

    return getQuery;
  };

  const updateProfile = () => {
    const updateAccountProfileMutation = useMutation({
      mutationFn: updateAccountProfile,
      onSuccess: (data, newProfileData) => {
        client.setQueriesData<any>(
          {queryKey: [QueryKeys.profile]},
          (oldProfileData: any) => {
            return {
              ...oldProfileData,
              firstName: newProfileData.firstName,
              lastName: newProfileData.lastName,
              phoneNumber: newProfileData.phoneNumber,
            };
          },
        );
      },
    });
    return updateAccountProfileMutation;
  };

  const updateProfileRole = () => {
    const updateAccountProfileRoleMutation = useMutation({
      mutationFn: updateAccountProfileRole,
    });
    return updateAccountProfileRoleMutation;
  };

  return {
    getProfile,
    updateProfile,
    updateProfileRole,
  };
};

export default useAccountProfile;
