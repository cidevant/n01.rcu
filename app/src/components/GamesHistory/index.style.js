import styled from 'styled-components';

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

export const GameInfo = styled.div`
    border-bottom: 2px solid #999;
    display: flex;
    flex-direction: row;
`;

export const GamePlayer = styled.div`
    width: 50%;
    margin: 40px 0;
    position: relative;

    text-align: center;
    border-right: 2px solid #ccc;

    &:last-child {
        border-right: none;
    }
`;

export const GamePlayerName = styled.div`
    font-size: 32px;
    color: #000;

    ${({ winner }) => winner && 'text-decoration: underline; font-weight: bold;'}
`;

export const GamePlayerStats = styled.div`
    font-size: 32px;
    font-weight: bold;
    text-align: center;
`;

export const GamePlayerLegs = styled.div`
    position: absolute;
    top: calc(50% - 43px);
    font-size: 64px;
    color: #bbb;
    z-index: -1;

    ${({ second }) => `${second ? 'right' : 'left'}: 0px;`};
`;

export const GameInfoModalPlayers = styled.div`
    display: flex;
    flex-direction: row;
    padding: 40px 10px;
`;

export const GameInfoModalPlayer = styled.div`
    width: 50%;
    padding: 10px;
    border-right: 2px solid #999;

    &:last-child {
        border-right: none;
    }
`;
