import styled from 'styled-components';

export const StyledTaskRow = styled.tr`
  display: block;
  height: 42px;
  width: 100%;
  border-right: 1px solid #AFBAC3;
  border-left: 1px solid #AFBAC3;
  border-bottom: 1px solid #AFBAC3;
  & div {
    display: flex;
    flex-direction: row;
    padding: 0;
  }
`;
