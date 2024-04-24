import { FONT_SIZE_14, disabledColor, } from "src/constants";
import { PNRegular } from "src/constants/fonts";
import styled from "styled-components/native";

export const ScheduleMainView = styled.View``;

export const HeaderLeftView = styled.View`
    flex-direction: column;
`;

export const HeaderRightView = styled.View``;

export const HeaderMonth = styled.Text`
    font-family: ${PNRegular};
    font-size: ${FONT_SIZE_14};
    color: ${disabledColor};
`;

