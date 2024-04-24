import moment, { Moment } from "moment";
import WeeklyRow from "./WeeklyRow";
import { accentColor } from "src/constants";
import { CalendarItemsView } from "./styled";
import { FlatList, RefreshControl, View } from "react-native";
import MonthWeekBar from "../MonthWeekBar/MonthWeekBar";
import React, { useEffect, useMemo, useState } from "react";
import { scheduleColors } from "src/Utils/generateScheduleColor";

import useGetActiveProjectId from "src/services/queries/useGetActiveProjectId";
import useGetProjectList from "src/services/queries/useGetProjectList";
import { QueryKeys } from "src/constants/enums";
import { useQuery } from "@tanstack/react-query";
import { getCalendar } from "src/services/ProjectService";
import ScheduleGeneralContracting from "../ScheduleGeneralContractingModal/ScheduleGeneralContractingModal";
import { RouteProp, useRoute } from "@react-navigation/native";
import ScheduleGeneralContractingModal from "../ScheduleGeneralContractingModal/ScheduleGeneralContractingModal";
import ScheduleWelcomeCallModal from "../ScheduleWelcomeCallModal/ScheduleWelcomeCallModal";

type Props = {
    setCurrentMonthNumber: (value: number) => void;
    currentMonthNumber: number,
}

export interface IScheduleData {
    event?: boolean,
    title: string,
    shortName: null,
    allDay: boolean,
    start: string,
    end: string,
    data: null,
    isScheduled: boolean,
    hasSaturdaysIncluded: null,
    hasSundaysIncluded: null,
    id: number,
    color: string,
}[]

export interface IGenerateData {
    startDate: moment.Moment,
    endDate: moment.Moment,
}[]

const generateData = () => {
    let startDate = moment();
    let startMonth = startDate.clone().startOf('month').startOf('week');
    const weeks = [] as IGenerateData[];
    for (let i = 0; i < 30; i++) {
        const weekStart = startMonth.clone().add(i * 7, 'days').startOf('week');
        const weekEnd = weekStart.clone().endOf('week');

        if (weekStart.day() !== 0) {
            weekStart.add(7, 'days');
            weekEnd.add(7, 'days');
        }

        weeks.push({ startDate: weekStart, endDate: weekEnd });
    }
    return weeks;
}

const getPrevMonth = (Month: Moment) => {
    let startMonth = Month.clone().startOf('month').startOf('weeks');

    let weeks = [];
    for (let i = 0; i < 36; i++) {
        const weekStart = startMonth.clone().add(i * 7, 'days').startOf('week');
        const weekEnd = weekStart.clone().endOf('week');

        if (weekStart.day() !== 0) {
            weekStart.add(7, 'days');
            weekEnd.add(7, 'days');
        }

        weeks.push({ startDate: weekStart, endDate: weekEnd, });
    }

    return weeks;
}

const isDuplicate = (dataArray: any[]) => {
    let uniqueArray: any = [];

    let seenDates: any = {};

    dataArray.forEach(function (item) {
        let key = item.startDate;

        if (!seenDates[key]) {
            seenDates[key] = true;
            uniqueArray.push(item);
        }
    });

    return uniqueArray;
};

const MonthCalendar: React.FC<Props> = ({ setCurrentMonthNumber }) => {
    let currentDate = moment();
    const { isPending: isGetProjectListLoading, data: useGetProjectsListData } = useGetProjectList();
    const activeProjectId = useGetActiveProjectId();
    const viewConfigRef = React.useRef({ waitForInteraction: true, viewAreaCoveragePercentThreshold: 50 })
    const flatListRef = React.useRef<FlatList>();
    const [currentMonthDate, setCurrentMonthDate] = useState(currentDate.startOf('month'));
    const [data, setData] = useState<IGenerateData[]>(generateData());
    const route = useRoute<RouteProp<any, 'Schedule'>>();
    const [showScheduleGeneralContractingModal, setShowScheduleGeneralContractingModal] = useState<boolean>(false);
    const [showScheduleWelcomeCallModal, setShowScheduleWelcomeCallModal] = useState<boolean>(false);
    const [actionPhase, setActionPhase] = useState<any>(undefined);

    useEffect(() => {
        if (route?.params?.openWelcomeCall) {
            setShowScheduleWelcomeCallModal(true);
            setActionPhase(route?.params?.phase);
        }
    }, [route])

    const { isPending: isLoading, data: scheduleData, isSuccess } = useQuery<IScheduleData[]>({
        queryKey: [QueryKeys.calendar, activeProjectId],
        queryFn: async ({ signal }) => {
            const resp = await getCalendar(activeProjectId!, signal)
            return mergeScheduleData(resp);
        },
        enabled: !!activeProjectId && data.length > 0,
    });

    const mergeScheduleData = (data: any) => {
        const transformedData = data.events.map((event: any, index: number) => ({ ...event, event: true, color: "#e3a75b" }))
            .concat(data.phases.map((phase: any, index: number) => ({ ...phase, event: false, color: scheduleColors[index] })));
        return transformedData;
    }

    const onViewCallBack = React.useCallback((viewableItems: any) => {
        const viewableItemsList = Object.keys(viewableItems ? viewableItems : {})?.map((type) => type === "viewableItems" && ({
            ...viewableItems[type][0],
        }))

        setCurrentMonthNumber(viewableItemsList[0]?.item?.startDate);
    }, [viewConfigRef])

    const renderItem = (i: { item: any, index: number }) => {
        let newScheduleData = [];
        if (isSuccess) {
            const weekStartDate = moment(i.item.startDate).startOf('day');
            const weekEndDate = moment(i.item.endDate).startOf('day');
            const filteredScheduleData = [...scheduleData]?.filter(event => {
                const eventStart = moment(event.start).startOf('day');
                const eventEnd = moment(event.end).startOf('day');
                const isEventWithinRange =
                    (eventStart.isSameOrAfter(weekStartDate, 'day') && eventStart.isSameOrBefore(weekEndDate, 'day')) ||
                    (eventEnd.isSameOrAfter(weekStartDate, 'day') && eventEnd.isSameOrBefore(weekEndDate, 'day')) ||
                    (eventStart.isBefore(weekStartDate, 'day') && eventEnd.isAfter(weekEndDate, 'day'));
                return isEventWithinRange;

            });
            newScheduleData.push(...filteredScheduleData);
        }

        return (
            <WeeklyRow
                setActionPhase={setActionPhase}
                setShowScheduleWelcomeCallModal={setShowScheduleWelcomeCallModal}
                setShowScheduleGeneralContractingModal={setShowScheduleGeneralContractingModal}
                isLoading={isLoading}
                scheduleData={newScheduleData}
                item={i.item} />
        )
    }

    const handleRefresh = () => {
        const firstDayOfYear = currentDate.clone().startOf('year');
        if (!moment(data[0] as any).isSame(firstDayOfYear, "day")) {
            const firstMonthData = currentMonthDate;
            const newData = [...getPrevMonth(firstMonthData.clone().subtract(1, 'month')), ...data]
            setCurrentMonthDate(firstMonthData.clone().subtract(1, 'month'));
            const uniqueArray = isDuplicate(newData);
            setData(uniqueArray);
        }
    };

    const _renderCalendar = useMemo(() => {
        return (
            <CalendarItemsView>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            tintColor={accentColor}
                            refreshing={false}
                            onRefresh={handleRefresh}
                        />
                    }
                    ref={flatListRef as any}
                    data={data}
                    renderItem={renderItem}
                    onEndReachedThreshold={0.1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    viewabilityConfig={viewConfigRef.current}
                    onViewableItemsChanged={onViewCallBack}
                    keyExtractor={(item, index) => index.toString() + index}
                    ListFooterComponent={<View style={{ height: 200 }} />}
                />
            </CalendarItemsView>
        )
    }, [data, scheduleData, isLoading])

    return (
        <>
            <MonthWeekBar />
            {_renderCalendar}
            {showScheduleGeneralContractingModal ? <ScheduleGeneralContractingModal color={actionPhase?.color!} phase={actionPhase!} visible={showScheduleGeneralContractingModal} setVisible={setShowScheduleGeneralContractingModal} /> : null}
            {showScheduleWelcomeCallModal ? <ScheduleWelcomeCallModal phase={actionPhase!} visible={showScheduleWelcomeCallModal} setVisible={setShowScheduleWelcomeCallModal} /> : null}
        </>);
};

export default MonthCalendar;

