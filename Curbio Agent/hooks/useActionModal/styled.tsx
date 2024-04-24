import styled from "styled-components/native";
import { FONT_SIZE_14, FONT_SIZE_20, blue, optionsModalBgColor, } from "src/constants";
import { PNRegular } from "src/constants/fonts";

export const ModalView = styled.View`
  background-color: ${optionsModalBgColor};
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
`;

export const ShareOptionTitleView = styled.View`
  align-items: center;
  justify-content: center;
  min-height: 42px;
  border-bottom-width: 1px;
  border-color: #969699;
  padding: 12px 16px;
`

export const ShareOptionTitle = styled.Text`
  text-align: center;
  font-size: ${FONT_SIZE_14};
  color: #747479;
`

export const ShareOptionButton = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-color: #969699;
  height: 60px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

export const ShareOptionButtonText = styled.Text`
  font-family: ${PNRegular};
  font-size: ${FONT_SIZE_20};
  color: ${blue};
  margin-right: 10px;
`


