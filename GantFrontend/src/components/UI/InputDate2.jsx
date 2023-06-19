import React from "react";
import styled from "styled-components";

const StyledDateInput = styled.div`
    
`;

const InputDate2 = (startDate,endDate,onChange) => {
    return (
        <StyledDateInput>
            <input type="date" value={startDate} onChange={onChange} />
            <span> - </span>
            <input type="date" value={endDate} onChange={onChange} />
        </StyledDateInput>
    )
}

export default InputDate2
