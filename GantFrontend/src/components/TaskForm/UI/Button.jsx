import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  background: ${(props) => props.colors[props.status]};
  border-radius: 5px;
  width: 125px;
  height: 32px;
  color: white;
`;

const ButtonForm = ({children, type = "button", onClick, status = "default"}) => {

    const colors = {
        default: "#004CE3",
        notActive: "#AFBAC3",
    };

    return (
        <StyledButton type={type} onClick={onClick} colors={colors} status={status}>
            {children}
        </StyledButton>
    );
};

export default ButtonForm;

