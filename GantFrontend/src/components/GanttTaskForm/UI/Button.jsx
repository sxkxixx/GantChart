import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.padding ? props.padding : '0 16px'};
  background: ${(props) => props.colors[props.status]};
  border-radius: 5px;
  width: ${props => props.width ? props.width : 'fit-content'};
  height: 32px;
  color: white;

  &:hover {
    box-shadow: 0px 0px 12px 0px rgba(40, 112, 255, 0.40);
  }
`;

const ButtonForm = ({children, type = "button", onClick, status = "default", width = 125, height = 32, padding}) => {

    const colors = {
        default: "#004CE3",
        notActive: "#AFBAC3",
        deleteTask: "#EB5757",
    };

    return (
        <StyledButton type={type} onClick={onClick} colors={colors} status={status} width={width} height={height} padding={padding}>
            {children}
        </StyledButton>
    );
};

export default ButtonForm;
