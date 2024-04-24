import React from 'react';
import { View } from 'react-native';
import moment, { Moment } from 'moment';
import { activeOpacity } from 'src/constants';
import { getDayLetter } from 'src/Utils/utils';
import { WeekBarListItemBtn, WeekBarListItemDay, WeekBarListItemNumber, WeekBarListView } from './styled';

type Props = {
    currentWeekData: {
        fullDate: moment.Moment;
        day: string;
        number: string;
    }[];
    setSelectedDate: (value: Moment[]) => void;
    selectedDate: Moment;
};

const WeekBar: React.FC<Props> = ({
    currentWeekData,
    setSelectedDate,
    selectedDate,
}) => {
    const currentDayData = {
        fullDate: moment().utc(),
        day: moment().utc().format('D'),
        number: moment().utc().format('dd'),
    };

    return (
        <View>
            <WeekBarListView>
                {currentWeekData?.map(
                    (item: { fullDate: Moment; day: string; number: string }, index) => {
                        let activeSelected = moment(selectedDate).isSame(moment(item.fullDate), 'day')
                        let currentDay = item.day === currentDayData.day;
                        return (
                            <WeekBarListItemBtn
                                activeSelected={activeSelected}
                                key={index}
                                activeOpacity={activeOpacity}
                                onPress={() => setSelectedDate([item.fullDate])}>
                                <WeekBarListItemNumber
                                    activeSelected={activeSelected}
                                    active={currentDay}>
                                    {getDayLetter(+item.number)}
                                </WeekBarListItemNumber>
                                <WeekBarListItemDay
                                    activeSelected={activeSelected}
                                    active={currentDay}>
                                    {item.day}
                                </WeekBarListItemDay>
                            </WeekBarListItemBtn>
                        );
                    },
                )}
            </WeekBarListView>
        </View>
    );
};

export default WeekBar;
