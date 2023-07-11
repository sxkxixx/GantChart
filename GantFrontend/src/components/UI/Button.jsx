import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  background: #004CE3;
  border-radius: 5px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  color: white;

  &:hover {
    box-shadow: 0px 0px 12px 0px rgba(40, 112, 255, 0.40);
  }
`;

const Button = ({children, type = "button", onClick, width = 248, height = 32}) => (
    <StyledButton type={type} onClick={onClick} width={width} height={height}>
        {children}
    </StyledButton>
)

export default Button
