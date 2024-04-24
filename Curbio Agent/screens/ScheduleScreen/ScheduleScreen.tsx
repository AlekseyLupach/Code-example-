import moment from 'moment';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { getWeekByWeekNumber } from 'src/Utils/utils';
import { HeaderLeftView, HeaderMonth } from './styled';
import WeekCalendar from './components/WeekCalendar/WeekCalendar';
import { Linking, StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderTitle, HeaderWrapper, ScreenView } from 'src/styled';
import MonthCalendar from './components/MonthCalendar/MonthCalendar';
import MonthUnavailable from './components/MonthUnavailable/MonthUnavailable';
import { activeOpacity, androidSaveAreaHeight, isAndroidPlatform } from 'src/constants';
import MonthBtnIcon from '@assets/ScheduleScreen/MonthBtn.svg';
import WeekBtnIcon from '@assets/ScheduleScreen/WeekBtn.svg';
import { queryClient } from 'src/services/queryClient';
import { QueryKeys } from 'src/constants/enums';
import useGetProjectById from 'src/services/queries/useGetProjectById';
import { useRoute } from '@react-navigation/native';

export enum scheduleScreenType {
    Month = 'Month',
    Week = 'Week',
}

const ScheduleScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const SafeAreaViewStyle: StyleProp<ViewStyle> = {
        marginTop: isAndroidPlatform ? androidSaveAreaHeight : 0,
        zIndex: 99999,
        marginLeft: 20, marginRight: 20,
        paddingTop: insets.top + 6,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    }
    const [currentMonthNumber, setCurrentMonthNumber] = useState<number>(
        moment().add(0, 'month').month() + 1
    );
    const [currentWeekNumber, setCurrentWeekNumber] = useState<number>(
        moment().week(),
    );
    const currentWeekData = getWeekByWeekNumber(currentWeekNumber);
    const previousTypeScreen = queryClient.getQueryData([QueryKeys.scheduleScreenType]) as scheduleScreenType;
    const [typeScreen, setTypeScreen] = useState<scheduleScreenType>(previousTypeScreen ? previousTypeScreen : scheduleScreenType.Month);
    const { data: projectByIdData, activeProjectId } = useGetProjectById();
    const scheduleVersion = projectByIdData ? projectByIdData?.scheduleVersion : 4;

    const getTypeScreenIcon = () => {
        switch (typeScreen) {
            case scheduleScreenType.Month:
                return {
                    icon: <WeekBtnIcon />,
                    header: (
                        <HeaderMonth>
                            {moment(currentMonthNumber, 'M').format('MMM YYYY')}
                        </HeaderMonth>
                    ),
                };
            case scheduleScreenType.Week:
                return {
                    icon: <MonthBtnIcon />,
                };
        }
    };

    const _renderScreenContent = () => {
        switch (typeScreen) {
            case scheduleScreenType.Month:
                return (
                    <MonthCalendar
                        currentMonthNumber={currentMonthNumber}
                        setCurrentMonthNumber={setCurrentMonthNumber}
                    />
                );
            case scheduleScreenType.Week:
                return (
                    <WeekCalendar
                        currentWeekData={currentWeekData}
                        setCurrentWeekNumber={setCurrentWeekNumber}
                    />
                );
        }
    };

    const changeScreenType = () => {
        if (typeScreen === scheduleScreenType.Month) {
            setTypeScreen(scheduleScreenType.Week);
            queryClient.setQueryData([QueryKeys.scheduleScreenType], scheduleScreenType.Week);
            return;
        }
        if (typeScreen === scheduleScreenType.Week) {
            setTypeScreen(scheduleScreenType.Month);
            queryClient.setQueryData([QueryKeys.scheduleScreenType], scheduleScreenType.Month);
            return;
        }
    };

    const _renderMainContent = () => (
        <ScreenView>
            <View style={SafeAreaViewStyle}>
                <HeaderWrapper>
                    <HeaderLeftView>
                        <HeaderTitle>Schedule</HeaderTitle>
                        {getTypeScreenIcon()?.header}
                    </HeaderLeftView>
                </HeaderWrapper>
                <TouchableOpacity activeOpacity={activeOpacity} onPress={changeScreenType}>
                    {getTypeScreenIcon()?.icon}
                </TouchableOpacity>
            </View>
            {_renderScreenContent()}
        </ScreenView>
    );

    return (
        <>
            {scheduleVersion < 4 ? (
                <MonthUnavailable
                    title="Calendar Unavailable"
                    subTitle="Projects started before Aug 5, 2023 aren't currently supported."
                    actionName="Unlock in the web app"
                    onPress={() =>
                        Linking.openURL(
                            `https://app.curbio.com/project/${activeProjectId}/schedule?returnPath=%2fhome`,
                        )
                    }
                />
            ) : (
                _renderMainContent()
            )}
        </>
    );
};

export default ScheduleScreen;
