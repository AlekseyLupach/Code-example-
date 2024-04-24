import React from "react";
import moment from "moment";
import { View } from "react-native";
import { Rect } from "react-native-svg";
import { IGenerateData, IScheduleData } from "./MonthCalendar";
import SvgAnimatedLinearGradient from "react-native-svg-animated-linear-gradient";
import { activeOpacity, isIosPlatform, primaryColor, screenWidth } from "src/constants";
import { EventLineColoredSegment, WeeklyRowDayText, WeeklyRowDayView, WeeklyRowEventLine, WeeklyRowEventText, WeeklyRowView } from "./styled";

type WeeklyRowProps = {
    item: IGenerateData,
    scheduleData: IScheduleData[],
    isLoading: boolean,
    setShowScheduleGeneralContractingModal: (arg: boolean) => void,
    setShowScheduleWelcomeCallModal: (arg: boolean) => void,
    setActionPhase: (arg: any) => void,
}

const WeeklyRow: React.FC<WeeklyRowProps> = ({ scheduleData, item, isLoading, setShowScheduleGeneralContractingModal, setShowScheduleWelcomeCallModal, setActionPhase }) => {
    const weeklyStartDate = moment(item.startDate).startOf('day');
    const weeklyEndDate = moment(item.endDate).endOf('day');
    const daysOfWeek = [];
    const firstMonthDay = "1";

    for (let i = 0; i < 7; i++) {
        daysOfWeek.push({
            fullDate: weeklyStartDate.clone().add(i, 'days'),
            day: weeklyStartDate.clone().add(i, 'days').format('D'),
            dayName: weeklyStartDate.clone().add(i, 'days').format('dddd')
        });
    }

    const handleOnPress = (phase: IScheduleData) => {
        setActionPhase(phase);
        if (!phase.event) {
            setShowScheduleGeneralContractingModal(true);
            return;
        }
        if (phase.event) {
            setShowScheduleWelcomeCallModal(true);
            return;
        }
    }

    const SkeletonLoader: React.FC = () => (
        <View style={{ zIndex: 2 }}>
            <SvgAnimatedLinearGradient height={80} width={screenWidth}>
                <Rect x="0" y={30} rx="5" width={screenWidth} height="20" />
                <Rect x="0" y={55} rx="5" width={screenWidth} height="20" />
            </SvgAnimatedLinearGradient>
        </View>
    )

    return (
        <WeeklyRowView>
            <View style={{ position: "absolute", flexDirection: "row", zIndex: 2 }}>
                {daysOfWeek.map((item, index) => (
                    <WeeklyRowDayView
                        style={{ zIndex: 3 }}
                        key={index}
                        active={moment().utc().isSame(moment(item.fullDate).utc(), 'day')}>
                        {item.day === firstMonthDay ?
                            <WeeklyRowDayText style={{ color: primaryColor }}>{item.fullDate.format("MMM D")}</WeeklyRowDayText> :
                            <WeeklyRowDayText>
                                {item.fullDate.format("D")}
                            </WeeklyRowDayText>}
                    </WeeklyRowDayView>
                ))}
            </View>
            {isLoading ? <SkeletonLoader /> : scheduleData.length > 0 && scheduleData.map((event, index, arr: any) => {
                const eventStartDay = moment(event.start).startOf('day');
                const eventEndDay = moment(event.end).endOf('day');
                const dayOfWeek = eventStartDay.day();
                const startDurationInDays = eventEndDay.diff(eventStartDay, 'days') + 1;
                const endDurationInDays = weeklyStartDate.clone().endOf('week').diff(eventEndDay, 'days');

                let eventDateContainsStartDate = moment(eventStartDay).isBetween(moment(weeklyStartDate), moment(weeklyEndDate), 'day', '()');
                let eventDateContainsEndDate = moment(eventEndDay).isBetween(weeklyStartDate, (weeklyEndDate), 'day', '()') || moment(eventEndDay).isSame(weeklyEndDate, 'day');

                return (
                    <WeeklyRowEventLine activeOpacity={activeOpacity} onPress={() => handleOnPress(event)} style={{ marginTop: index === 0 ? 30 : 0, marginBottom: index === arr.length - 1 ? 10 : 4 }} key={index}>
                        <EventLineColoredSegment style={{
                            justifyContent: isIosPlatform ? "center" : "flex-start",
                            left: eventDateContainsStartDate ? screenWidth / 7 * dayOfWeek : 0,
                            width: eventDateContainsEndDate && !eventDateContainsStartDate ? screenWidth - (screenWidth / 7 * endDurationInDays) : screenWidth / 7 * startDurationInDays,
                            backgroundColor: event?.color!,
                            borderTopLeftRadius: eventDateContainsStartDate ? 40 : 0,
                            borderBottomLeftRadius: eventDateContainsStartDate ? 40 : 0,
                            borderTopRightRadius: eventDateContainsEndDate ? 40 : 0,
                            borderBottomRightRadius: eventDateContainsEndDate ? 40 : 0,
                        }}>
                            <WeeklyRowEventText numberOfLines={1} >{event.title}</WeeklyRowEventText>
                        </EventLineColoredSegment>
                    </WeeklyRowEventLine >
                )
            })}
        </WeeklyRowView>
    );
};

export default WeeklyRow;

