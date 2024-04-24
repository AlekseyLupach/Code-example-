import { FONT_SIZE_12, FONT_SIZE_14, FONT_SIZE_16, accentColor, basicTextColor, disabledColor, screenWidth, whiteColor } from "src/constants";
import { PNMedium, PNRegular, PNSemiBold } from "src/constants/fonts";
import styled from "styled-components/native";

export const HeaderView = styled.View`
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
`

export const HeaderLeftView = styled.View`
    flex-direction: column;
`;

export const HeaderMonth = styled.Text`
    font-family: ${PNRegular};
    font-size: ${FONT_SIZE_14};
    color: ${disabledColor};
    margin-top: 5px;
`;

export const WeekBarItemsView = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

export const WeekBarItemBtn = styled.View<{ activeSelected: boolean }>`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.activeSelected ? accentColor : whiteColor};
    border-radius: 12px;
    width: ${screenWidth / 7}px;
    height: 46px;
`;

export const WeekBarNumber = styled.Text<{ active: boolean, activeSelected: boolean }>`
    font-size: ${FONT_SIZE_12};
    font-family: ${(props) => props.activeSelected ? PNSemiBold : props.active ? PNSemiBold : PNMedium};
    color: ${(props) => props.activeSelected ? whiteColor : props.active ? accentColor : "#b6beca"};
`;