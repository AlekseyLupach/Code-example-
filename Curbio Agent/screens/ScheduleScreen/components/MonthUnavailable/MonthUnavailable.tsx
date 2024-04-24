import React from "react";
import { accentColor } from "src/constants";
import Header from "src/components/Header/Header";
import { HeaderTitle, ScreenView } from "src/styled";
import { ButtonComponent } from "src/components/Button/Button";

import UnavailableIcon from "@assets/ScheduleScreen/Unavailable.svg";
import { MonthUnavailableText, MonthUnavailableTitle, MonthUnavailableView } from "./styled";

type Props = {
    title: string,
    subTitle: string,
    actionName: string,
    onPress: () => void,
}

const MonthUnavailable: React.FC<Props> = ({ title, subTitle, actionName, onPress }) => {
    return (
        <ScreenView>
            <Header headerLeft={<HeaderTitle>Schedule</HeaderTitle>} />
            <MonthUnavailableView>
                <UnavailableIcon />
                <MonthUnavailableTitle>{title}</MonthUnavailableTitle>
                <MonthUnavailableText>{subTitle}</MonthUnavailableText>
                <ButtonComponent
                    onPress={onPress}
                    titleStyle={{ color: accentColor, fontSize: 14 }}
                    buttonStyle={{ minWidth: 0, width: 195, height: 32, borderColor: accentColor }}
                    title={actionName} transparent={true} />
            </MonthUnavailableView >
        </ScreenView>
    );
};

export default MonthUnavailable;

