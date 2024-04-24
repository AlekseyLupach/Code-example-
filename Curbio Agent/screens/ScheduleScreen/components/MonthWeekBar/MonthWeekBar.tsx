import React from "react";
import { View } from "react-native";
import moment, { Moment } from "moment";
import { activeOpacity } from "src/constants";
import { getCurrentWeek } from "src/Utils/utils";
import { WeekBarItemBtn, WeekBarItemsView, WeekBarNumber } from "./styled";

const MonthWeekBar: React.FC = () => {
    const currentDayData = { fullDate: moment().utc(), day: moment().utc().format("D"), number: moment().utc().format("dd") }
    const currentWeekData = getCurrentWeek();

    const getDayLetter = (index: number) => {
        let dayLetter = '';

        switch (index) {
            case 0:
                dayLetter = 'S';
                break;
            case 1:
                dayLetter = 'M';
                break;
            case 2:
                dayLetter = 'T';
                break;
            case 3:
                dayLetter = 'W';
                break;
            case 4:
                dayLetter = 'T';
                break;
            case 5:
                dayLetter = 'F';
                break;
            case 6:
                dayLetter = 'S';
                break;
        }

        return dayLetter;
    };


    return (
        <View>
            <WeekBarItemsView>
                {currentWeekData?.map((item: { fullDate: Moment, day: string, number: string, }, index) => (
                    <WeekBarItemBtn key={index} activeOpacity={activeOpacity}>
                        <WeekBarNumber
                            active={item.day === currentDayData.day}>
                            {getDayLetter(+item.number)}
                        </WeekBarNumber>
                    </WeekBarItemBtn>
                ))}
            </WeekBarItemsView>
        </View>
    );
};

export default MonthWeekBar;
