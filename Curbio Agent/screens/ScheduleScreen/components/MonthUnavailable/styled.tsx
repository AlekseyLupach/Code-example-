import { FONT_SIZE_16, FONT_SIZE_18, disabledColor, primaryColor } from "src/constants";
import { PNRegular, PNSemiBold } from "src/constants/fonts";
import styled from "styled-components/native";

export const MonthUnavailableView = styled.View`
    flex: 1;
    align-items: center;
    padding: 24px;
    margin-top: 26px;
`;

export const MonthUnavailableTitle = styled.Text`
    font-family: ${PNSemiBold};
    font-size: ${FONT_SIZE_18};
    color: ${primaryColor};
    margin-bottom: 8px;
`;

export const MonthUnavailableText = styled.Text`
    font-family: ${PNRegular};
    font-size: ${FONT_SIZE_16};
    color: ${disabledColor};
    margin-bottom: 24px;
    text-align: center;
`;