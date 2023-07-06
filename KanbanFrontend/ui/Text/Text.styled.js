import styled, { css } from "styled-components";

function getTextType(type) {
    switch (type) {
        case "title-1":
            return css`
                font-weight: 700;
                font-size: 24px;
                line-height: 28px;
            `;
        case "body-1":
            return css`
                font-weight: 500;
                font-size: 14px;
                line-height: 32px;
                color: var(--basic-dark-grey);
            `;
        case "body-2":
            return css`
                font-weight: 500;
                font-size: 18px;
                line-height: 20px;
            `;
        case "body-3":
            return css`
                font-weight: 500;
                font-size: 18px;
                line-height: 20px;
            `;
        case "body-4":
            return css`
                font-weight: 500;
                font-size: 14px;
                line-height: 24px;
            `;
        case "body-5":
            return css`
                font-weight: 500;
                font-size: 14px;
                line-height: 16px;
            `;
        case "body-6":
            return css`
                font-weight: 500;
                font-size: 16px;
                line-height: 32px;
            `;
        case "body-7":
            return css`
                font-weight: 500;
                font-size: 20px;
                line-height: 48px;
            `;
        case "body-8":
            return css`
                font-weight: 500;
                font-size: 20px;
                line-height: 20px;
            `;
        case "body-9":
            return css`
                font-weight: 500;
                font-size: 14px;
                line-height: 16px;
            `;
        case "description-1":
            return css`
                font-weight: 400;
                font-size: 14px;
                line-height: 16px;
            `;
        case "description-2":
            return css`
                font-weight: 400;
                font-size: 16px;
                line-height: 20px;
            `;
        case "description-3":
            return css`
                font-weight: 400;
                font-size: 18px;
                line-height: 20px;
            `;
        case "description-4":
            return css`
                font-weight: 400;
                font-size: 16px;
                line-height: 32px;
            `;
        case "description-5":
            return css`
                font-weight: 400;
                font-size: 14px;
                line-height: 16px;
                color: var(--basic-dark-grey);
            `;
        case "description-6":
            return css`
                font-weight: 400;
                font-size: 14px;
                line-height: 32px;
                color: var(--basic-dark-grey);
            `;
        case "description-7":
            return css`
                font-weight: 400;
                font-size: 14px;
                line-height: 24px;
                color: var(--basic-dark-grey);
            `;
        case "description-8":
            return css`
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
                color: var(--basic-dark-grey);
            `;
    }
    // eslint-disable-next-line
    const exhaustiveChecking = type;
}

export const Text = styled.div`
    ${({ type }) => getTextType(type)}
`;
