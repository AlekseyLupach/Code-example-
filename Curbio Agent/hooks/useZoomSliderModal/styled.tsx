import { FONT_SIZE_12, FONT_SIZE_14, screenHeight, screenWidth, whiteColor, windowBGColorBlack } from "src/constants";
import { PNBold, PNMedium, PNRegular } from "src/constants/fonts";
import styled from "styled-components/native";

export const BgView = styled.View`
    background-color:#000000;
    flex: 1;
`;

export const HeaderView = styled.View`
    position: absolute;
    z-index: 2;
`;

export const MainView = styled.View`
    flex-shrink: 1;
    width: ${screenWidth}px;
    height: ${screenHeight}px;
    justify-content: center;
    align-items: center;
`;

export const FooterView = styled.View`
    margin-top: 8px;
    padding: 12px;
    border-radius: 12px;
    margin: 8px 24px 0px 24px;
    background-color: ${windowBGColorBlack};
`;

export const InnerView = styled.View`
    position: absolute;
    bottom: 60px;
`;

export const PagView = styled.View`
    flex: 1;
    justify-content: flex-end;
    flex-direction: row;
`;

export const PagItemView = styled.View`
    border-radius: 12px;
    padding: 12px;
    background-color: ${windowBGColorBlack};
    height: 40px;
    min-width: 48px;
    margin: 0px 24px;
    justify-content: center;
    align-items: center;
`;

export const PagText = styled.Text`
    font-family: ${PNMedium};
    font-size: ${FONT_SIZE_14};
    color: ${whiteColor};
`;

export const TopView = styled.View`
    margin-bottom: 8px;
    flex-direction: row;
    justify-content: space-between;
`;

export const TopLeftView = styled.View`
    flex: 1;
`;

export const TopLeftDate = styled.Text`
    font-family: ${PNRegular};
    font-size: ${FONT_SIZE_12};
    color: ${whiteColor};
    margin-bottom: 4px;
`;

export const TopLeftType = styled.Text`
    font-family: ${PNBold};
    font-size: ${FONT_SIZE_14};
    color: ${whiteColor};
    flex: 1;
`;

export const BottomView = styled.View``;

export const BottomDesc = styled.Text`
    font-family: ${PNMedium};
    font-size: ${FONT_SIZE_14};
    color: ${whiteColor};
`;   