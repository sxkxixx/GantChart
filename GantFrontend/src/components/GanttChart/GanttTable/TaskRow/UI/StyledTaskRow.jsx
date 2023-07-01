import styled from 'styled-components';

export const StyledTaskRow = styled.tr`
  display: block;
  height: 42px;
  width: 100%;
  border-right: 1px solid black;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  & div {
    display: flex;
    flex-direction: row;
    padding: 0;
  }
`;
