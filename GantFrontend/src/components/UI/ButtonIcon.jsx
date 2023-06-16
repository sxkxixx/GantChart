import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    
`;

const ButtonIcon = ({children, type = "button", onClick}) => (
    <StyledButton type={type} onClick={onClick}>
        {children}
    </StyledButton>
)

export default ButtonIcon
