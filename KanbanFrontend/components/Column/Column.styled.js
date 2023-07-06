import styled from "styled-components";

export const Header = styled.div`
    padding: 0 22px;
    border-radius: 5px;
    font-size: 20px;
    text-transform: uppercase;
    color: #ffffff;
    margin-bottom: 32px;
    line-height: 48px;
`;

export const StyledColumn = styled.div`
    :nth-child(1) ${Header} {
        background: #b1b7ba;
    }

    :nth-child(2) ${Header} {
        background: #eb5757;
    }

    :nth-child(3) ${Header} {
        background: #3fa2f7;
    }

    :nth-child(4) ${Header} {
        background: #ffc400;
    }

    :nth-child(5) ${Header} {
        background: #56c568;
    }
`;

export const Tasks = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;
