import React from 'react';
import styled from 'styled-components';

const StyledSelect = styled.select`
  
`;

const SelectText = ({ options, onChange }) => (
    <StyledSelect onChange={onChange}>
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </StyledSelect>
)

export default SelectText
