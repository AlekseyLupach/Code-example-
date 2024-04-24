import moment from 'moment';
import { Circle, Rect } from 'react-native-svg';
import TradesListV2 from '../TradesListV2/TradesListV2';
import CalendarStrip from 'react-native-calendar-strip';
import { accentColor, screenWidth } from 'src/constants';
import { scheduleColors } from 'src/Utils/generateScheduleColor';
import { PNMedium, PNRegular, PNSemiBold } from 'src/constants/fonts';
import useGetActiveProjectId from 'src/services/queries/useGetActiveProjectId';
import { getCalendar, getMasterSchedules } from 'src/services/ProjectService';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View, } from 'react-native';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { WeekCalendarItemDateNoAvailableText, WeekCalendarItemDateText, WeekCalendarItemDateView, WelcomeCallItemCircleView, WelcomeCallItemLeftView, WelcomeCallItemName, WelcomeCallItemTime, WelcomeCallItemView } from './styled';

type Props = {
    currentWeekData: {
        fullDate: moment.Moment;
        day: string;
        number: string;
    }[];
    setCurrentWeekNumber: Dispatch<SetStateAction<number>>;
};

const generateDateList = () => {
    let currentDate = moment();

    let days = [];
    for (let i = -180; i < 181; i++) {
        days.push(
            {
                fullDate: moment(currentDate).utc().add(i, 'days').startOf('day'),
                dayNumber: moment(currentDate).utc().add(i, 'days').format("D"),
                month: moment(currentDate).utc().add(i, 'days').month()
            }
        );
    }
    return days;
}

const WeekCalendar: React.FC<Props> = ({ currentWeekData, setCurrentWeekNumber, }) => {
    const scrollViewRef = useRef<ScrollView | null>(null);
    const activeProjectId = useGetActiveProjectId();
    const [scrollViewDate, setScrollViewDate] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [scrollPositionDate, setScrollPositionDate] = useState(moment());
    const [dataSourceCords, setdataSourceCords] = useState<number[]>([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let startWeekDate = currentWeekData[0].fullDate;
        let endWeekDate = currentWeekData[currentWeekData.length - 1].fullDate;
        setIsLoading(true);
        try {
            const [schedulesResponse, calendarResponse] = await Promise.all([
                getMasterSchedules(activeProjectId!, startWeekDate, endWeekDate),
                getCalendar(activeProjectId!),
            ]);

            const schedulesRes = schedulesResponse.map((item: any, index: number) => ({ ...item, color: scheduleColors[index] }));
            const calendarRes = calendarResponse;

            const dateList = generateDateList();
            schedulesRes.forEach((item: any) => {
                item.startDate = moment(item.startDate);
                item.endDate = moment(item.endDate);
            });
            dateList.forEach((dateItem: any) => {
                dateItem.items = schedulesRes.filter((item: any) =>
                    item.startDate.isSameOrBefore(dateItem.fullDate, 'day') &&
                    item.endDate.isSameOrAfter(dateItem.fullDate, 'day')
                ),
                    dateItem.events = calendarRes.events.filter((item: any) =>
                        moment(item.start).isSameOrBefore(dateItem.fullDate, 'day') &&
                        moment(item.end).isSameOrAfter(dateItem.fullDate, 'day')
                    )
            });

            setScrollViewDate(dateList);
        } catch (error) {
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1500)
        }
    };

    const handleOnDateSelected = (date: moment.Moment) => {
        if (dataSourceCords.length > 0 && scrollViewDate.length > 0) {
            const indexToScroll = scrollViewDate.findIndex((item: any) => moment(item.fullDate).isSame(date, 'day'));
            scrollViewRef?.current?.scrollTo({
                x: 0, y: dataSourceCords[indexToScroll]
            })
        }
    };

    const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const targetCoordinate = event.nativeEvent.contentOffset.y;
        let minDifference = Math.abs(targetCoordinate - dataSourceCords[0]);
        let closestIndex = 0;

        for (let i = 1; i < dataSourceCords.length; i++) {
            const difference = Math.abs(targetCoordinate - dataSourceCords[i]);
            if (difference < minDifference) {
                minDifference = difference;
                closestIndex = i;
            }
        }
        setScrollPositionDate(scrollViewDate[closestIndex]?.fullDate)
    };


    const _render = useMemo(() => {
        return (
            <View>
                {<ScrollView
                    scrollEventThrottle={200}
                    ref={scrollViewRef}
                    onLayout={() => {
                        setTimeout(() => {
                            scrollViewRef?.current?.scrollTo({ x: 0, y: dataSourceCords[180], animated: false })
                        }, 1500)
                    }}
                    onScroll={handleOnScroll}
                >
                    {scrollViewDate?.map((item: any, index: number) => {
                        const itemDate = moment(item?.fullDate);
                        return (
                            <View key={index} onLayout={(event) => {
                                const layout = event.nativeEvent.layout;
                                dataSourceCords[index] = layout.y;
                                setdataSourceCords(dataSourceCords);
                                if (index === 1) {
                                    setTimeout(() => {
                                        scrollViewRef?.current?.scrollTo({ x: 0, y: dataSourceCords[180], animated: false })
                                    }, 1000)
                                }
                            }}>
                                <WeekCalendarItemDateView>
                                    <WeekCalendarItemDateText>
                                        {itemDate.format('MMM D, dddd')}
                                    </WeekCalendarItemDateText>
                                </WeekCalendarItemDateView>
                                <View >
                                    {item?.events?.length > 0 &&
                                        item?.events.map((event: any, index: number) => (
                                            <WelcomeCallItemView key={index}>
                                                <WelcomeCallItemLeftView>
                                                    <WelcomeCallItemCircleView />
                                                    <WelcomeCallItemName>{event.title}</WelcomeCallItemName>
                                                </WelcomeCallItemLeftView>
                                                <WelcomeCallItemTime>
                                                    {moment(item.start).format('h:mm A')}
                                                </WelcomeCallItemTime>
                                            </WelcomeCallItemView>
                                        ))
                                    }
                                    {item?.items?.length > 0 && <TradesListV2 isWeekView={true} trades={item.items} />}
                                    {item?.events?.length <= 0 && item?.items?.length <= 0 && < WeekCalendarItemDateNoAvailableText > No available tasks</WeekCalendarItemDateNoAvailableText>}
                                </View>
                            </View>
                        )
                    })}
                    <View style={{ height: 200 }} />
                </ScrollView>}
            </View >
        )
    }, [scrollViewDate])


    const SkeletonLoader: React.FC = () => (
        <SvgAnimatedLinearGradient height={"100%"} width={"100%"}>
            <Rect x="20" y={5} rx="5" width={screenWidth - 40} height="90" />

            <Rect x="20" y={100} rx="5" width={screenWidth - 40} height="24" />

            <Circle y={132} x="10" cx="20" cy="20" r="10" />
            <Rect y={142} x="50" rx="5" width={screenWidth - 70} height="20" />

            <Rect x="20" y={180} rx="5" width={screenWidth - 40} height="30" />
            <Rect x="20" y={222} rx="5" width={screenWidth - 40} height="2" />
            <Rect x="20" y={238} rx="5" width={screenWidth - 40} height="30" />
            <Rect x="20" y={280} rx="5" width={screenWidth - 40} height="2" />

            <Rect x="20" y={296} rx="5" width={screenWidth - 40} height="30" />
            <Rect x="20" y={338} rx="5" width={screenWidth - 40} height="2" />

            <Rect x="20" y={354} rx="5" width={screenWidth - 40} height="30" />
            <Rect x="20" y={396} rx="5" width={screenWidth - 40} height="2" />

            <Circle y={412} x="10" cx="20" cy="20" r="10" />
            <Rect y={422} x="50" rx="5" width={screenWidth - 70} height="20" />

            <Rect x="20" y={460} rx="5" width={screenWidth - 40} height="30" />
            <Rect x="20" y={502} rx="5" width={screenWidth - 40} height="2" />
            <Rect x="20" y={518} rx="5" width={screenWidth - 40} height="30" />
            <Rect x="20" y={560} rx="5" width={screenWidth - 40} height="2" />

            <Rect x="20" y={572} rx="5" width={screenWidth - 40} height="30" />
            <Rect x="20" y={614} rx="5" width={screenWidth - 40} height="2" />

            <Rect x="20" y={630} rx="5" width={screenWidth - 40} height="30" />
            <Rect x="20" y={672} rx="5" width={screenWidth - 40} height="2" />
        </SvgAnimatedLinearGradient>
    )


    return (
        <>
            {/* {isLoading && < AbsoluteLoader containerStyle={{ marginTop: insets.top + 61, backgroundColor: "white" }} />} */}
            {isLoading && < SkeletonLoader />}
            <CalendarStrip
                maxDate={moment().add(181, 'day')}
                minDate={moment().subtract(180, 'day')}
                onDateSelected={(date) => handleOnDateSelected(date)}
                selectedDate={scrollPositionDate ? scrollPositionDate : undefined}
                useIsoWeekday={true}
                scrollable={true}
                scrollerPaging={true}
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white' }}
                style={{ height: 90, paddingTop: 0, paddingBottom: 10, }}
                calendarHeaderFormat='MMM'
                calendarHeaderContainerStyle={{ marginLeft: 20, alignSelf: "flex-start" }}
                calendarHeaderStyle={{ color: '#828282', fontSize: 14, fontFamily: PNRegular, fontWeight: "400" }}
                highlightDateContainerStyle={{ width: 39, backgroundColor: accentColor, borderRadius: 12 }}
                calendarColor={'white'}
                dateNumberStyle={{ marginBottom: 4, color: 'black', fontSize: 16, fontFamily: PNSemiBold, fontWeight: "600" }}
                highlightDateNumberStyle={{ marginBottom: 4, color: 'white', fontSize: 16, fontFamily: PNSemiBold, fontWeight: "600" }}
                leftSelector={false}
                rightSelector={false}
                showMonth={true}
                showDayName={true}
                showDayNumber={true}
                showDate={true}
                iconLeftStyle={{ width: 0, height: 0 }}
                iconRightStyle={{ width: 0, height: 0 }}
                dateNameStyle={{ marginTop: 4, marginBottom: 4, color: '#b6beca', fontSize: 12, fontFamily: PNMedium, fontWeight: "500" }}
                highlightDateNameStyle={{ marginTop: 4, marginBottom: 4, color: 'white', fontSize: 12, fontFamily: PNMedium, fontWeight: "500" }}
            />
            {_render}
        </>
    );
};

export default WeekCalendar;
