import styled from "styled-components/native";
import { PNMedium, PNSemiBold } from "src/constants/fonts";
import { FONT_SIZE_12, FONT_SIZE_14, black, screenWidth, transparentColor, whiteColor } from "src/constants";

export const CalendarItemsView = styled.View``;

export const WeeklyRowView = styled.View`
    min-height: 80px;
    background-color: ${transparentColor};
    border-bottom-width: 1px;
    border-bottom-color: #ebebeb;
`;

export const WeeklyRowDayView = styled.View<{ active: boolean }>`
    width: ${screenWidth / 7}px;
    min-height: 80px;
    align-items: center;
    padding-top: 5px;
    background-color: ${(props) => props.active ? "#e8f0f0" : transparentColor};
`;

export const WeeklyRowDayText = styled.Text`
    color: ${black};
    font-family: ${PNMedium};
    font-size: ${FONT_SIZE_14};
`;

export const WeeklyRowEventLine = styled.TouchableOpacity`
    flex-direction: row;
    height: 20px;
    background-color: ${whiteColor};
    z-index: 2;
`;

export const EventLineColoredSegment = styled.View``;

export const WeeklyRowEventText = styled.Text`
    font-family: ${PNSemiBold};
    font-size: ${FONT_SIZE_12};
    color: ${whiteColor};
    margin-left: 5px;
    margin-right: 5px;
`;

