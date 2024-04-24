import { FONT_SIZE_12, FONT_SIZE_16, accentColor, basicTextColor, screenWidth, whiteColor } from "src/constants";
import { PNMedium, PNSemiBold } from "src/constants/fonts";
import styled from "styled-components/native";

export const WeekBarListView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 16px;
    border-bottom-width: 1px;
    border-bottom-color: #EDEDED;
    padding: 16px 16px 12px 16px;
`;

export const WeekBarListItemBtn = styled.TouchableOpacity<{ activeSelected: boolean }>`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.activeSelected ? accentColor : whiteColor};
    border-radius: 12px;
    height: 46px;
    width: 40px;
    max-width: ${screenWidth / 7}px;
`;

export const WeekBarListItemNumber = styled.Text<{ active: boolean, activeSelected: boolean }>`
    font-size: ${FONT_SIZE_12};
    font-family: ${(props) => props.activeSelected ? PNSemiBold : props.active ? PNSemiBold : PNMedium};
    color: ${(props) => props.activeSelected ? whiteColor : props.active ? accentColor : "#b6beca"};
`;


export const WeekBarListItemDay = styled.Text<{ active: boolean, activeSelected: boolean }>`
    font-size: ${FONT_SIZE_16};
    font-family: ${PNMedium};
    margin-bottom: 4px;
    font-family: ${(props) => props.activeSelected ? PNSemiBold : props.active ? PNSemiBold : PNMedium};
    color: ${(props) => props.activeSelected ? whiteColor : props.active ? accentColor : basicTextColor};
`;
