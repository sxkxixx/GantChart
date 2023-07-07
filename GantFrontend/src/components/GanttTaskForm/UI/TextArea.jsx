import React from 'react';
import styled from 'styled-components';

const TextAreaField = styled.textarea`
  width: ${props => props.width ? props.width : '100%'};
  height: ${props => props.height ? props.height : '80px'};
  padding: 10px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background: #FFFFFF;
  resize:none;
  
  &::placeholder{
    text-align: left;
    vertical-align: top;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  // ${props => props.disabled && `
  //   cursor: not-allowed;
  // `}
`;

const TextArea = ({ placeholder, value, onChange ,width, height, disabled = false, ...rest }) => (
    <TextAreaField
        width={width}
        height={height}
        disabled={disabled}
        {...rest}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
    />
);

export default TextArea;
