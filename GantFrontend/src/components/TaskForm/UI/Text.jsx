import React from 'react';
import styled from 'styled-components';

const InputField = styled.input`
  width: ${props => props.width ? props.width : '100%'};
  height: ${props => props.height ? props.height : '40px'};
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background: #FFFFFF;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  ${props => props.disabled && `
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

const Text = ({ width, height, disabled = false, ...rest }) => (
    <InputField
        width={width}
        height={height}
        disabled={disabled}
        {...rest}
        placeholder="Название задачи"
    />
);
export default Text;
