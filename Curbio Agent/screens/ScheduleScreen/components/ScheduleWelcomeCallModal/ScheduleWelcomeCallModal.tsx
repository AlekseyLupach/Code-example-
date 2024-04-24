import moment from "moment";
import Modal from "react-native-modal";
import { HeaderTitle } from "src/styled";
import { Circle, Rect } from "react-native-svg";
import FastImage from "react-native-fast-image";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { activeOpacity, whiteColor } from "src/constants";
import { NavigationProps } from "src/navigation/navigation";
import CloseButton from "src/components/CloseButton/CloseButton";
import { TouchableOpacity, Animated, FlatList, Linking } from "react-native";
import SvgAnimatedLinearGradient from "react-native-svg-animated-linear-gradient";
import { СoloredСircle, DateRangeDate, DateRangeView, Header, HeaderCloseBtnView, View, HeaderTitleView, SectionName, ParticipantsView, LocationView, NotesView, NotesValue, LocationValue, ParticipantName, ParticipantView, TopLine } from "./styled";
import useGetActiveProjectId from "src/services/queries/useGetActiveProjectId";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "src/constants/enums";
import { getCalendarEventAttendees } from "src/services/ProjectService";

interface IWellcomeCallData {
    durationInBusinessDays: number,
    endDate: string,
    endDateClient: string,
    eventTemplateId: null,
    id: number,
    initialEndDate: null,
    initialStartDate: null,
    isComplete: null,
    isCustomerActionNeeded: boolean,
    isDependent: boolean,
    isNew: boolean,
    isRequired: boolean,
    isSubmitted: boolean,
    location: null | string,
    meetingDate: null,
    name: string,
    notes: string,
    order: number,
    parentMilestoneId: null,
    project: null,
    projectId: number,
    requestedById: null,
    requestedEndDate: null,
    requestedId: null,
    requestedStartDate: null,
    stage: number,
    stageId: null,
    startDate: string,
    startDateClient: string
}

type Props = {
    phase: IWellcomeCallData,
    visible: boolean,
    setVisible: (arg: boolean) => void,
}

const ScheduleWelcomeCallModal: React.FC<Props> = ({ setVisible, visible, phase }) => {
    const navigation = useNavigation<NavigationProps>();
    const activeProjectId = useGetActiveProjectId();
    const { isPending: isLoading, data: participantList, isSuccess } = useQuery<any[]>({
        queryKey: [QueryKeys.participantList, activeProjectId,],
        queryFn: async ({ signal }) => getCalendarEventAttendees(activeProjectId!, signal),
        enabled: !!activeProjectId,
    });

    const onClose = () => {
        setVisible(false);
    }

    const renderParticipants = (i: { item: any, index: number }) => (
        <TouchableOpacity
            style={{ marginRight: 20, minHeight: 64 }}
            activeOpacity={activeOpacity}
            onPress={() => navigationToContact(i.item)}>
            <ParticipantView>
                <FastImage
                    style={{ height: 40, width: 40, borderRadius: 24, marginBottom: 5 }}
                    source={{ uri: i.item.img }}
                />
                <ParticipantName>{i.item.name.split(' ')[0]}</ParticipantName>
            </ParticipantView>
        </TouchableOpacity>
    )

    const navigationToContact = (contact: any) => {
        onClose();
        navigation.navigate("PROJECT_TEAM_CONTACT", { phase: phase, isParticipant: true, email: contact.email, fullName: contact.name, phoneNumber: contact.phone, photo: contact.img, type: contact.displayJobTitle });
    }

    const Loader: React.FC = () => (
        <SvgAnimatedLinearGradient height={64}>
            <Circle cx="20" cy="20" r="20" />
            <Rect x="0" y="45" rx="0" ry="0" width="40" height="10" />
            <Circle cx="80" cy="20" r="20" />
            <Rect x="60" y="45" rx="0" ry="0" width="40" height="10" />
            <Circle cx="140" cy="20" r="20" />
            <Rect x="120" y="45" rx="0" ry="0" width="40" height="10" />
            <Circle cx="200" cy="20" r="20" />
            <Rect x="180" y="45" rx="0" ry="0" width="40" height="10" />
        </SvgAnimatedLinearGradient>
    )

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
            }}>
                <TopLine />
                <Header>
                    <HeaderTitleView>
                        <СoloredСircle style={{ marginRight: 5, backgroundColor: "#E3A75A" }} />
                        <HeaderTitle>{phase?.title}</HeaderTitle>
                    </HeaderTitleView>
                    <HeaderCloseBtnView>
                        <CloseButton onPress={onClose} />
                    </HeaderCloseBtnView>
                </Header>
                <View style={{ marginBottom: 40, paddingLeft: 16, paddingRight: 16 }}>
                    <TouchableOpacity activeOpacity={1}>
                        <View>
                            <DateRangeView>
                                <SectionName>Date:</SectionName>
                                <DateRangeDate>{moment(phase.startDate).format("MMM D, H:MM A")} - {moment(phase.endDate).format("H:MM A")}</DateRangeDate>
                            </DateRangeView>
                            <ParticipantsView>
                                <SectionName style={{ marginBottom: 16 }}>Participants:</SectionName>
                                {isLoading && !isSuccess ? <Loader /> : <FlatList
                                    nestedScrollEnabled={true}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={participantList}
                                    renderItem={renderParticipants}
                                    keyExtractor={(item, index) => item.name.toString() + index}
                                />}
                            </ParticipantsView>
                            {phase.location && <LocationView>
                                <SectionName style={{ marginBottom: 8 }}>Location:</SectionName>
                                <LocationValue onPress={() => Linking.openURL(phase.location!)}>{phase.location}</LocationValue>
                            </LocationView>}
                            {phase.notes && <NotesView>
                                <SectionName style={{ marginBottom: 16 }}>Notes:</SectionName>
                                <NotesValue>
                                    {phase.notes}
                                </NotesValue>
                            </NotesView>}
                        </View>
                    </TouchableOpacity>
                </View>
            </Animated.View >
        </Modal >
    )
};

export default ScheduleWelcomeCallModal;