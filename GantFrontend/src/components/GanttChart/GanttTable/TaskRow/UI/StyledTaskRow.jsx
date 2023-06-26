import styled from 'styled-components';

export const StyledTaskRow = styled.tr`
  display: block;
  height: 42px;
  width: 100%;
  & td {
    display: flex;
    justify-content: space-between;
    height: 100%;
    padding: 0;
  }
`;
