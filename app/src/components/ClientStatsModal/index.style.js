import styled from 'styled-components';
export const ButtonWrapper = styled.div`
    height: 150px;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.4);
    z-index: 10;

    & > button {
        border-radius: 0;
        font-size: 80px;
    }
`;
export const Wrapper = styled.div`
    padding-top: 30px;
    padding-bottom: 30px;
    background-color: #eee;
    margin-bottom: 20px;
`;

export const Title = styled.div`
    width: 100%;
    text-align: center;
    font-size: 30px;
    color: #999;
`;

export const StatValue = styled.div`
    width: 100%;
    text-align: center;
    font-size: 60px;
    font-weight: bolder;
`;

export const Flex = styled.div`
    display: flex;
    flex-direction: row;
`;

export const FlexItem = styled.div`
    flex-grow: 1;
    min-width: 150px;

    ${(props) =>
        props.nav &&
        `
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 80px;
        flex-grow: 0;
    `};

    ${({ disabled }) => disabled && 'color: #ccc;'};
`;

export const GameInfo = styled.div`
    border-bottom: 1px solid #000;
    display: flex;
    flex-direction: row;
`;

export const GamePlayer = styled.div`
    width: 50%;
    padding: 10px 0;
    text-align: center;
    border-right: 1px solid #999;

    &:last-child {
        border-right: none;
    }

    ${({ winner }) => winner && 'background-color: rgba(0, 255, 0, 0.2);'};
`;

export const GamePlayerName = styled.div`
    font-size: 32px;
    color: #555;
`;

export const GamePlayerStats = styled.div`
    font-size: 42px;
    font-weight: bold;
`;
