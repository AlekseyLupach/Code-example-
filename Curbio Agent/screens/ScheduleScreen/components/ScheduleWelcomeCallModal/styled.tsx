import styled from "styled-components/native";
import { PNMedium, PNRegular, PNSemiBold } from "src/constants/fonts";
import { FONT_SIZE_12, FONT_SIZE_14, FONT_SIZE_16, FONT_SIZE_18, accentColor, basicTextColor, borderColor, disabledColor, primaryColor, whiteColor } from 'src/constants';
import { acc } from "react-native-reanimated";

export const View = styled.View`

`;

export const HeaderTitleView = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const СoloredСircle = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 150px;
`;

export const Header = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 48px;
  border-bottom-width: 1px;
  border-bottom-color: ${borderColor};
`;

export const Main = styled.View`
  padding: 0px 16px;
`;

export const HeaderCloseBtnView = styled.View`
  position: absolute;
  top: auto;
  bottom: auto;
  right: 16px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${FONT_SIZE_18};
  font-family: ${PNSemiBold};
  color: ${primaryColor};
`;

export const ProjectAddressView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
  margin-bottom: 16px;
`;

export const DateRangeView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 21px 0px;
  border-bottom-width: 1px;
  border-bottom-color: #EDEDED;
`;

export const DateRangeDate = styled.Text`
  font-family: ${PNMedium};
  font-size: ${FONT_SIZE_14};
  color: ${basicTextColor};
`;

export const JobItemView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #EDEDED;
`;

export const JobItemName = styled.Text`
  font-family: ${PNRegular};
  font-size: ${FONT_SIZE_12};
  color: ${basicTextColor};
  flex: 1;
`;

export const JobItemDate = styled.Text`
  font-family: ${PNRegular};
  font-size: ${FONT_SIZE_12};
  color: ${disabledColor};
`;


export const ParticipantsView = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #EDEDED;
  padding-bottom: 10px;
  margin-bottom: 10px;
  min-height: 60px;
`;

export const LocationView = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #EDEDED;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

export const LocationValue = styled.Text`
  font-family: ${PNRegular};
  font-size: ${FONT_SIZE_12};
  color: ${accentColor};
`;

export const NotesView = styled.View`
  font-family: ${PNSemiBold};
  font-size: ${FONT_SIZE_12};
  color: ${accentColor};
`;

export const NotesValue = styled.Text`
  font-family: ${PNRegular};
  font-size: ${FONT_SIZE_12};
  color: ${basicTextColor};
`;

export const SectionName = styled.Text`
  font-family: ${PNMedium};
  font-size: ${FONT_SIZE_14};
  color: ${basicTextColor};
`;

export const ParticipantView = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


export const ParticipantName = styled.Text`
  font-family: ${PNRegular};
  font-size: ${FONT_SIZE_12};
`;

export const TopLine = styled.View`
  height: 4px;
  background-color: #D9D9D9;
  border-radius: 14px;
  width: 73px;
  margin: 10px auto 10px auto;
`;


