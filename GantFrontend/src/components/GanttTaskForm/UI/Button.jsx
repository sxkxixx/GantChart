import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  background: ${(props) => props.colors[props.status]};
  border-radius: 5px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  color: white;
`;

const ButtonForm = ({children, type = "button", onClick, status = "default", width = 125, height = 32}) => {

    const colors = {
        default: "#004CE3",
        notActive: "#AFBAC3",
    };

    return (
        <StyledButton type={type} onClick={onClick} colors={colors} status={status} width={width} height={height}>
            {children}
        </StyledButton>
    );
};

export default ButtonForm;
