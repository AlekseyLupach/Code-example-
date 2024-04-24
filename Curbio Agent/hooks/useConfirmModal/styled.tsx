import styled from "styled-components/native";
import { FONT_SIZE_14, FONT_SIZE_24, black, whiteColor, windowBGColorBlack } from "src/constants";
import { PNRegular, PNSemiBold } from "src/constants/fonts";

export const BackgroundView = styled.TouchableOpacity`
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 999;
  background-color: ${windowBGColorBlack};
`;

export const InnerView = styled.View`
  background-color: ${whiteColor};
  width: 90%;
  border-radius: 20px;
  position: relative;
  padding: 20px;
  justify-content: center;
  align-items: center;

`

export const CloseButtonView = styled.View`
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 2;
`

export const Title = styled.Text`
  color: ${black};
  font-size: ${FONT_SIZE_24};
  font-family: ${PNSemiBold};
  margin-bottom: 16px;
`

export const SubTitle = styled.Text`
  color: ${black};
  font-size: ${FONT_SIZE_14};
  font-family: ${PNRegular};
  text-align: center;
  margin-bottom: 30px;
`