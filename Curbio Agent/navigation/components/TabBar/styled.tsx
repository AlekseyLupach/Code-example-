import { whiteColor } from "src/constants";
import styled from "styled-components/native";
import { BOTTOM_TAB_BAR_HEIGHT } from "./TabBar";

export const TabBarView = styled.View`
    background-color: ${whiteColor};
`;

export const TabBarViewContainer = styled.View`
    height: ${BOTTOM_TAB_BAR_HEIGHT}px;
    border-top-width: 1px;
    border-top-color: #1D1D1D24;
    background-color: ${whiteColor};
`;
