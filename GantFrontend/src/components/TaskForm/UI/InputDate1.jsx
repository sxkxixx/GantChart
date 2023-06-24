import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 8px;
  width: 184px;
  height: 32px;
  border-radius: 5px;
  border: 1px solid var(--basic-grey, #AFBAC3);
  background: #FFF;
`;

const StyledSpan = styled.span`
  color: #000;
  font-size: 14px;
  font-weight: bold;
`;

const InputDate1 = ({ value, onChange }) => (
    <div>
        <StyledSpan>Дедлайн</StyledSpan>
        <StyledInput type="date" value={value} onChange={onChange} />
    </div>
)

export default InputDate1
