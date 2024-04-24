import styled from "styled-components/native";
import { PNMedium, PNRegular, PNSemiBold } from "src/constants/fonts";
import { FONT_SIZE_12, FONT_SIZE_14, FONT_SIZE_18, basicTextColor, disabledColor, primaryColor } from 'src/constants';

export const View = styled.View``;

export const СoloredСircle = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 150px;
`;

export const Main = styled.View`
  padding: 0px 16px;
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
  padding: 11px 0px;
`;

export const DateRangeName = styled.Text`
  font-family: ${PNMedium};
  font-size: ${FONT_SIZE_14};
  color: ${basicTextColor};
`;

export const DateRangeDate = styled.Text`
  font-family: ${PNMedium};
  font-size: ${FONT_SIZE_14};
  color: ${basicTextColor};
`;

export const JobHeaderView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const JobHeaderSectionName = styled.Text`
  font-family: ${PNMedium};
  font-size: ${FONT_SIZE_12};
  color: ${basicTextColor};
  background-color: #eff5f4;
  padding: 5px 16px;
  border-radius: 16px;
  overflow: hidden;
`;

export const JobHeaderABCView = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const JobHeaderABCName = styled.Text`
  font-family: ${PNSemiBold};
  font-size: ${FONT_SIZE_12};
  color: ${primaryColor};
  margin-left: 4px;
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
  margin-right: 10px;
`;

export const JobItemDate = styled.Text`
  font-family: ${PNRegular};
  font-size: ${FONT_SIZE_12};
  color: ${disabledColor};
`;



