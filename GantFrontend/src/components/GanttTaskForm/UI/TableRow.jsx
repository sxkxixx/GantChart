import React from 'react';
import styled from 'styled-components';

const StyledLi = styled.li`
    border-radius: 8px;
    border: 1px solid #B6BDC3;
    background: #FFF;
    padding: 24px 16px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    color: #31393C;

    &:hover, &:focus {
        border-radius: 8px;
        border: 1px solid #B6BDC3;
        background: #FFF;
        box-shadow: 0px 0px 12px 0px rgba(40, 112, 255, 0.40);
        cursor: pointer;
    }
`;

const StyledDiv1 = styled.div`
    flex-basis: 40%;
`;

const StyledDiv2 = styled.div`
    flex-basis: 20%;
`;

const StyledDiv3 = styled.div`
    flex-basis: 20%;
`;

const StyledDiv4 = styled.div`
    flex-basis: 20%;
`;

const TableRow = ({project, director, startDate, endDate}) => (
    <StyledLi>
        <StyledDiv1>{project}</StyledDiv1>
        <StyledDiv2>{director}</StyledDiv2>
        <StyledDiv3>{startDate}</StyledDiv3>
        <StyledDiv4>{endDate}</StyledDiv4>
    </StyledLi>
);

export default TableRow;
