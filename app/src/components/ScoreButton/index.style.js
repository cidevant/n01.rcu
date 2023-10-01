import styled from 'styled-components';

export const Button = styled.div`
    color: black;
    background-color: #eee;
    border: 6px solid #aaa;
    box-shadow: 2px 2px 6px 1px #666;
    width: 100%;
    font-size: 100px;
    padding: 20px 0;
    display: block;
    text-align: center;
    opacity: 1;
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    font-weight: bolder;

    ${({ buttonStyle }) => {
        switch (buttonStyle) {
            case 'zero':
                return 'background-color: red; border-color: #b30000; color: white;';
            case 'good':
                return 'background-color: #ddffcc; border-color: #4ce600;';
            case 'outs':
            case 'yellow':
                return 'background-color: #faf5a7; border-color: #c06d00;';
            case 'finish':
                return 'background-color: #22ff34; border-color: #2d8600;';
        }
    }}

    &.touching {
        background-color: #15c900;
        transition: background-color 1s;
    }

    &.confirmed {
        border-color: #fff;
        color: white;
    }

    &.error {
        background-color: red;
        color: white;
        transition: background-color 1s;
    }
`;
