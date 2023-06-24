import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  background: #004CE3;
  border-radius: 5px;
  width: 248px;
  height: 32px;
  color: white;
`;

const Button = ({children, type = "button", onClick}) => (
    <StyledButton type={type} onClick={onClick}>
        {children}
    </StyledButton>
)

export default Button
