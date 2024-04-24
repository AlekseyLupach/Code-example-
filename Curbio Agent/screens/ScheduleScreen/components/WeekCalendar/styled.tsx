import { FONT_SIZE_12, FONT_SIZE_14, FONT_SIZE_16, FONT_SIZE_18, disabledColor, primaryColor } from "src/constants";
import { PNMedium, PNRegular, PNSemiBold } from "src/constants/fonts";
import styled from "styled-components/native";

export const WelcomeCallItemView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: #EDEDED;
    padding-bottom: 18px;
    margin-bottom: 16px;
   margin-left: 16px;
   margin-right: 16px;
`;

export const WelcomeCallItemLeftView = styled.View`
    flex-direction: row;
`;

export const WelcomeCallItemCircleView = styled.View`
    height: 20px;
    width: 20px;
    border-radius: 150px;
    background-color: #E3A75A;
    margin-right: 4px;
`;

export const WelcomeCallItemName = styled.Text`
    font-family: ${PNSemiBold};
    font-size: ${FONT_SIZE_14};
`;

export const WelcomeCallItemTime = styled.Text`

`;

export const WelcomeCallEmptyView = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
    margin-bottom: 75px;
`;

export const WelcomeCallEmptyTitle = styled.Text`
    font-family: ${PNSemiBold};
    font-size: ${FONT_SIZE_18};
    color: ${primaryColor};
    margin-bottom: 8px;
`;

export const WelcomeCallEmptyText = styled.Text`
    font-family: ${PNRegular};
    font-size: ${FONT_SIZE_16};
    color: ${disabledColor};
    margin-bottom: 24px;
    text-align: center;
    padding: 0px 24px;
`;

export const WeekCalendarItemDateView = styled.View`
    background-color: #ECECEC;
    width: 100%;
    height: 24px;
    flex-direction: row;
    align-items: center;
    padding: 0px 8px;
    margin-bottom: 18px;
`;

export const WeekCalendarItemDateText = styled.Text`
    font-family: ${PNRegular};
    font-size: ${FONT_SIZE_12};
    color: ${disabledColor};
`;

export const WeekCalendarItemDateNoAvailableText = styled.Text`
    font-family: ${PNMedium};
    font-size: ${FONT_SIZE_14};
    color: ${disabledColor};
    margin-top: 18px;
    margin-bottom: 26px;
    text-align: center;
`;
