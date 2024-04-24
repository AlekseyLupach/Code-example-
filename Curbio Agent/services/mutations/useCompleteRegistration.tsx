import { useMutation } from "@tanstack/react-query";
import { updateLeadSource } from "src/services/ProfileService";
import logger from "src/logging/applicationInsights";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "src/navigation/navigation";
import { queryClient } from "src/services/queryClient";
import { QueryKeys } from "src/constants/enums";
import { completeRegistration, refreshToken } from "src/services/AuthService";
import { UserRoleEnum } from "src/api/generated";
import { logout } from 'src/screens/SettingsScreen/SettingsScreen';

type CompleteRegistrationParams = {
    firstName?: string,
    lastName?: string,
    phoneNumber: string,
    userRole: UserRoleEnum,
    leadSource: string,
    authProvider: string,
    accessToken: string;
    refreshToken: string;
}

const useCompleteRegistration = () => {
    const navigation = useNavigation<NavigationProps>();
    const completeRegistrationMutation = useMutation({ mutationFn: completeRegistration });
    const refreshTokenMutation = useMutation({ mutationFn: refreshToken });
    const updateLeadSourceMutation = useMutation({ mutationFn: updateLeadSource });

    const _completeRegistration = async (config: CompleteRegistrationParams) => {
        await completeRegistrationMutation.mutateAsync({
            phoneNumber: config.phoneNumber,
            userRole: config.userRole
        },
            {
                onSuccess: () => {
                    logger.trackEvent({ name: `user onboard complete`, properties: { registrationType: config.authProvider } });
                },
                onError: () => {
                    logout();
                    logger.trackEvent({ name: `account complete registration error`, properties: { registrationType: config.authProvider } });
                    return;
                }
            }
        )
        await refreshTokenMutation.mutateAsync({ accessToken: config.accessToken!, refreshToken: config.refreshToken! },
            {
                onSuccess: async (resp) => {
                    queryClient.setQueryData([QueryKeys.auth], resp);
                },
                onError: async () => {
                    logout();
                    return;
                }
            }
        )
        navigation.navigate('HOME_SCREEN', {});
        await updateLeadSourceMutation.mutateAsync({ howDidYouHearAboutUs: config?.leadSource })
    }

    return _completeRegistration
}

export default useCompleteRegistration;