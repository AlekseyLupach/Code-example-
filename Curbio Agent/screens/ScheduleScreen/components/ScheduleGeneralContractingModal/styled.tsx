import { borderColor } from 'src/constants';
import styled from "styled-components/native";

export const View = styled.View``;

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
  margin-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${borderColor};
`;

export const HeaderCloseBtnView = styled.View`
  position: absolute;
  top: auto;
  bottom: auto;
  right: 16px;
`;

export const TopLine = styled.View`
  height: 4px;
  background-color: #D9D9D9;
  border-radius: 14px;
  width: 73px;
  margin: 10px auto 10px auto;
`;