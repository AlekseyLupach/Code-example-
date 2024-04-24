import Modal from "react-native-modal";
import { HeaderTitle } from "src/styled";
import { QueryKeys } from "src/constants/enums";
import { useQuery } from "@tanstack/react-query";
import Loader from "src/components/Loader/Loader";
import React, { useEffect, useState } from "react";
import { activeOpacity, whiteColor } from "src/constants";
import TradesList from "./components/TradesList/TradesList";
import { getPhaseDetails } from "src/services/ProjectService";
import CloseButton from "src/components/CloseButton/CloseButton";
import { TouchableOpacity, Animated, Easing } from "react-native";
import useGetActiveProjectId from "src/services/queries/useGetActiveProjectId";
import { СoloredСircle, Header, HeaderCloseBtnView, HeaderTitleView, TopLine } from "./styled";
import { IScheduleData } from "src/screens/ScheduleScreen/components/MonthCalendar/MonthCalendar";

import ScrollUpIcon from "@assets/ScheduleScreen/ScrollUp.svg";
import ScrollDownIcon from "@assets/ScheduleScreen/ScrollDown.svg";

type ScheduleGeneralContractingModalProps = {
    phase: IScheduleData,
    color: string,
    visible: boolean,
    setVisible: (arg: boolean) => void,
}

const ScheduleGeneralContractingModal: React.FC<ScheduleGeneralContractingModalProps> = ({ setVisible, visible, color, phase }) => {
    const [height] = useState(new Animated.Value(500));
    const [isLargeModal, setIsLargeModal] = useState<boolean>(false);
    const activeProjectId = useGetActiveProjectId();
    const { isPending: isLoading, data: getPhaseDetailsData, isSuccess } = useQuery<any[]>({
        queryKey: [QueryKeys.phaseDetails, activeProjectId, phase.id],
        queryFn: async ({ signal }) => getPhaseDetails(activeProjectId!, phase.id, signal),
        enabled: !!activeProjectId,
    });

    const onClose = () => {
        setVisible(false);
    }

    useEffect(() => {
        if (isLargeModal) {
            showError()
            return;
        }
        hideError()
    }, [isLargeModal])

    const showError = () => {
        Animated.timing(height, {
            toValue: 800,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false
        }).start(() => { });
    }

    const hideError = () => {
        Animated.timing(height, {
            toValue: 500,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false
        }).start(() => { })
    }

    const maxHeight = height.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    });

    return (
        <Modal
            propagateSwipe={true}
            swipeDirection={['down']}
            animationIn={"slideInUp"}
            animationOut={"slideOutDown"}
            animationInTiming={500}
            onBackdropPress={onClose}
            testID={'modal'}
            isVisible={visible}
            onSwipeComplete={onClose}
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}>
            <Animated.View style={{
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                overflow: 'hidden',
                backgroundColor: whiteColor,
                height: maxHeight
            }}>
                <TopLine />
                <Header>
                    <HeaderTitleView>
                        <СoloredСircle style={{ marginRight: 5, backgroundColor: color }} />
                        <HeaderTitle>{phase.title}</HeaderTitle>
                    </HeaderTitleView>
                    <HeaderCloseBtnView>
                        <CloseButton onPress={onClose} />
                    </HeaderCloseBtnView>
                </Header>
                {isLoading && !isSuccess ? <Loader /> : getPhaseDetailsData && getPhaseDetailsData?.length > 0 ? <TradesList trade={getPhaseDetailsData} phase={phase} /> : <></>}
                <TouchableOpacity
                    activeOpacity={activeOpacity}
                    style={{ alignItems: "center", backgroundColor: "trasnparent", marginBottom: 20 }}
                    onPress={() => setIsLargeModal(!isLargeModal)}>
                    {!isLargeModal ? <ScrollUpIcon /> : <ScrollDownIcon />}
                </TouchableOpacity>
            </Animated.View >
        </Modal >
    )
};

export default ScheduleGeneralContractingModal;