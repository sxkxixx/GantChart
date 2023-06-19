import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  
`;

const InputDate1 = ({ value, onChange }) => (
    <StyledInput type="date" value={value} onChange={onChange} />
)

export default InputDate1
