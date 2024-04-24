import React, { useEffect } from "react";
import { Circle, Rect } from "react-native-svg";
import { QueryKeys } from "src/constants/enums";
import Header from "src/components/Header/Header";
import { useMutation } from "@tanstack/react-query";
import logger from "src/logging/applicationInsights";
import { toastService } from "src/Utils/toastService";
import { queryClient } from "src/services/queryClient";
import { refreshToken } from "src/services/AuthService";
import { useNavigation } from "@react-navigation/native";
import useGetAuth from "src/services/queries/useGetAuth";
import { screenHeight, screenWidth } from "src/constants";
import { NavigationProps } from "src/navigation/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import useAccountProfile from "src/services/queries/useAccountProfile";
import { useConfirmModal } from "src/hooks/useConfirmModal/useConfirmModal";
import styled, { HeaderTitle, HeaderWrapper, ScreenView } from "../../styled";
import SvgAnimatedLinearGradient from "react-native-svg-animated-linear-gradient";
import { removeInspectorCompany, removePartner } from "src/services/ProfileService";

import ConfirmIcon from "@assets/Confirm.svg";

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const auth = useGetAuth();
    const { getProfile } = useAccountProfile();
    const { data: profileData, isFetching, refetch: refetchProfile } = getProfile();
    const removePartnerMutation = useMutation({ mutationFn: removePartner })
    const refreshTokenMutation = useMutation({ mutationFn: refreshToken })
    const removeInspectorCompanyMutation = useMutation({ mutationFn: removeInspectorCompany })
    const confirmModal = useConfirmModal();

    const partnerParams = {
        partnerName: auth.partnerName,
        partnerCode: auth.partnerCode,
        parnerType: auth.partnerType,
        partnerShortText: auth.partnerSplashScreenText,
    }

    const inspectorCompanyParams = {
        inspectorCompanyCode: profileData?.inspectorCompanyCode,
        inspectorCompanyName: profileData?.inspectorCompanyName,
        inspectorCompanyId: profileData?.inspectorCompanyId,
    }

    useEffect(() => {
        logger.trackPageView({ isLoggedIn: true, name: "my profile - screen view" });
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (<>
                <GoBackButton />
                <HeaderTitle>My Profile</HeaderTitle>
            </>),
        })
    }, [])

    const handleRemovePartnerModal = () => {
        logger.trackEvent({ name: "my profile - remove partner select" });
        logger.trackEvent({ name: "my profile - confirm partner remove - popup view" });
        confirmModal.openConfirmModal({
            icon: <ConfirmIcon />,
            title: "Are you sure?",
            subTitle: `This will remove the “${auth.partnerName}” branding from your app. You can restore the branding using your partner link later, if you wish.`,
            action: (setLoading: (isLoading: boolean) => void) => handleRemovePartner(setLoading),
            onPressCloseLog: logger.trackEvent({ name: "my profile - confirm partner remove - close" }),
            onPressNoLog: logger.trackEvent({ name: "my profile - confirm partner remove - no select" }),
        });
    }

    const handleRemovePartner = async (setLoading: (isLoading: boolean) => void) => {
        setLoading(true);
        logger.trackEvent({ name: "my profile - confirm partner remove - yes select" });
        await removePartnerMutation.mutateAsync({}, {
            onSuccess: () => {
                logger.trackEvent({ name: "Partner remove", properties: { ...partnerParams } });
            },
            onError: () => {
                logger.trackEvent({ name: "Partner remove error", properties: { ...partnerParams } });
                setLoading(false);
            }
        })
        await refreshTokenMutation.mutateAsync({ accessToken: auth.accessToken!, refreshToken: auth.refreshToken! }, {
            onSuccess: async (resp) => {
                queryClient.setQueryData([QueryKeys.auth], {
                    ...auth,
                    accessToken: resp.accessToken,
                    refreshToken: resp.refreshToken,
                    partnerName: null,
                    partnerCode: null,
                    partnerSplashScreenText: null,
                    partnerType: null,
                });
            },
            onError: () => {
                setLoading(false);
                return;
            }
        });
        setLoading(false);
        confirmModal.closeConfirmModal();
        toastService.toastSuccess("Partnership has been changed.");
        navigation.navigate("Home", {});
    }

    const handleRemoveInspectorCompany = () => {
        logger.trackEvent({ name: "my profile - remove inspector company select" });
        logger.trackEvent({ name: "my profile - confirm remove inspector company - popup view" });
        confirmModal.openConfirmModal({
            icon: <ConfirmIcon />,
            title: "Are you sure?",
            subTitle: `This will remove the “${profileData?.inspectorCompanyName}” inspector company from your app. You can restore the inspector company using your inspector code link later, if you wish.`,
            action: (setLoading: (isLoading: boolean) => void) => delInspectorCompany(setLoading),
            onPressCloseLog: logger.trackEvent({ name: "my profile - confirm remove inspector company - close" }),
            onPressNoLog: logger.trackEvent({ name: "my profile - confirm remove inspector company - no select" }),
        });
    }

    const delInspectorCompany = async (setLoading: (isLoading: boolean) => void) => {
        setLoading(true);
        logger.trackEvent({ name: "my profile - confirm remove inspector company - yes select" });
        await removeInspectorCompanyMutation.mutateAsync({}, {
            onSuccess: () => {
                logger.trackEvent({ name: "Inspector company remove", properties: { ...inspectorCompanyParams } });
            },
            onError: () => {
                logger.trackEvent({ name: "Inspector company remove error", properties: { ...inspectorCompanyParams } });
                setLoading(false);
                return;
            }
        })
        await refreshTokenMutation.mutateAsync({ accessToken: auth.accessToken!, refreshToken: auth.refreshToken! }, {
            onSuccess: async (resp) => {
                queryClient.setQueryData([QueryKeys.auth], {
                    ...auth,
                    accessToken: resp.accessToken,
                    refreshToken: resp.refreshToken,
                });
                refetchProfile();
            },
            onError: async () => {
                queryClient.setQueryData([QueryKeys.auth], {
                    ...auth,
                    accessToken: "",
                    refreshToken: "",
                });
                setLoading(false);
                return;
            }
        })
        setLoading(false);
        confirmModal.closeConfirmModal();
        toastService.toastSuccess("Inspector Company has been changed.");
        navigation.navigate("Home", {});
    }

    const headerLeft = () => (
        <HeaderWrapper>
            <GoBackButton onPress={() => {
                logger.trackEvent({ name: `setting view - back button select` });
                navigation.goBack()
            }} />
            <HeaderTitle style={{ marginLeft: 8 }}>My Profile</HeaderTitle>
        </HeaderWrapper>
    )

    const SkeletonLoader: React.FC = () => (
        <SvgAnimatedLinearGradient height={screenHeight} width={screenWidth}>
            <Circle y="68" x={screenWidth / 2 - 20} cx="20" cy="20" r="70" />
            <Rect x={screenWidth / 2 / 2} y={170} rx="4" width="200" height="30" />
            {[1, 2, 3, 4].map((item, index) => (
                <Rect key={index} x={20} y={232 + index * 58} rx="4" width={screenWidth - 40} height="48" />
            ))}
        </SvgAnimatedLinearGradient>
    )

    return (
        <ScreenView>
            <Header headerLeft={headerLeft()} />
            {isFetching ? <SkeletonLoader /> :
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <SafeAreaView style={[styled.padding, styled.androidSafeArea, { paddingTop: 18 }]} edges={["bottom"]}>
                        {profileData && <ProfileForm
                            profileData={profileData}
                            handleRemoveInspectorCompany={handleRemoveInspectorCompany}
                            handleRemovePartner={handleRemovePartnerModal}
                        />}
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            }
            {confirmModal.confirmModalComponent}
        </ScreenView>
    );
};

export default ProfileScreen;
