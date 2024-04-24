import React from "react";
import moment from "moment";
import { ScrollView, TouchableOpacity } from "react-native";
import { DateRangeDate, DateRangeName, DateRangeView, JobHeaderABCName, JobHeaderABCView, JobHeaderSectionName, JobHeaderView, View } from "./styled";

import ABCIcon from "@assets/ScheduleScreen/ABC.svg";
import { IScheduleData } from "src/screens/ScheduleScreen/components/MonthCalendar/MonthCalendar";
import JobTasksDropdown from "src/screens/ScheduleScreen/components/TradesList/JobTasksDropdown/JobTasksDropdown";
import { schedulePhaseProjectTask } from "src/screens/ScheduleScreen/components/WeekCalendar/types";

type Props = {
    trade: schedulePhaseProjectTask[],
    phase: IScheduleData,
}

const TradesList: React.FC<Props> = ({ trade, phase }) => {
    return (
        <ScrollView style={{ paddingLeft: 16, paddingRight: 16 }}>
            <TouchableOpacity activeOpacity={1}>
                <View>
                    <DateRangeView>
                        <DateRangeName>Date Range:</DateRangeName>
                        <DateRangeDate>{moment(phase.start).format("MMM D")} - {moment(phase.end).format("MMM D")}</DateRangeDate>
                    </DateRangeView>
                    {trade[0]?.tradeName ?
                        <JobHeaderView>
                            <JobHeaderSectionName>{trade[0]?.tradeName} ({trade?.length})</JobHeaderSectionName>
                            <JobHeaderABCView>
                                <ABCIcon />
                                <JobHeaderABCName>ABC {trade[0]?.tradeName}</JobHeaderABCName>
                            </JobHeaderABCView>
                        </JobHeaderView>
                        : <></>}
                    {trade ? <JobTasksDropdown showFullDate={true} projectTasks={trade} /> : <></>}
                </View>
            </TouchableOpacity>
        </ScrollView >
    )
};

export default TradesList;