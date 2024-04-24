import styled from "styled-components/native";
import { FONT_SIZE_12, accentColor, } from 'src/constants';
import { PNMedium } from "src/constants/fonts";

export const ShowMoreBtn = styled.TouchableOpacity`
    flex-direction: row;
    margin-bottom: 7px;
`;

export const ShowMoreText = styled.Text`
  font-family: ${PNMedium};
  font-size: ${FONT_SIZE_12};
  color: ${accentColor};
  margin-right: 5px;
`;