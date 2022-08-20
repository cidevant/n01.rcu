import styled from 'styled-components';

export const CornerButton = styled.button`
    color: white;
    background-color: ${({ color }) => color};
    display: block;
    text-align: center;
    border: 0;
    opacity: 1;
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    font-weight: bolder;
    width: 150px;
    outline: none;
    height: 150px;

    &:active {
        opacity: 0.8;
        background-color: #999;
    }

    /* &:disabled {
        & > * {
            color: #000;
        }
    } */
`;

export default CornerButton;
