import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 8px;
  width: 160px;
  height: 32px;
  border-radius: 5px;
  border: 1px solid var(--basic-grey, #AFBAC3);
  background: #FFF;
  font-size: 14px;
`;

const StyledSpan = styled.span`
  color: #000;
  font-size: 14px;
  font-weight: bold;
`;

const InputDate1 = ({ value, onChange, disabled, defaultValue }) => (
    <div>
        <StyledSpan>Дедлайн</StyledSpan>
        <StyledInput type="date" defaultValue={defaultValue} value={value} onChange={onChange} disabled={disabled}/>
    </div>
)

export default InputDate1
