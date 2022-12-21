import React from 'react';
import { Modal } from 'react-bootstrap';
import { stripAverageFromName } from '../../utils/stats';
import styled from 'styled-components';
import { usePlayerGameHistory } from '../../hooks/useGameHistory';

function ItemGamesHistory({ playerName, close }) {
    const name = stripAverageFromName(playerName)?.trim?.();
    const { stats, loading } = usePlayerGameHistory(name);

    return (
        <Modal
            dialogClassName="XL_MODAL"
            show={playerName !== false}
            fullscreen={false}
            onHide={close}
        >
            <H1>{playerName}</H1>

            {loading === true && <LoadingState>Loading...</LoadingState>}
            {loading === false && stats?.length === 0 && <LoadingState>No data</LoadingState>}
            {stats?.length > 0 &&
                stats?.map?.((game) => {
                    const p1Stats = ((game.p1allScore / game.p1allDarts) * 3).toFixed(2);
                    const p2Stats = ((game.p2allScore / game.p2allDarts) * 3).toFixed(2);

                    return (
                        <Wrapper key={game.mid}>
                            <Player>
                                <PlayerName
                                    owner={stripAverageFromName(playerName).includes(game.p1name)}
                                >
                                    {game.p1name}
                                </PlayerName>
                                <PlayerStats>{p1Stats}</PlayerStats>
                            </Player>

                            <Player>
                                <PlayerName
                                    owner={stripAverageFromName(playerName).includes(game.p2name)}
                                >
                                    {game.p2name}
                                </PlayerName>
                                <PlayerStats>{p2Stats}</PlayerStats>
                            </Player>
                        </Wrapper>
                    );
                })}
        </Modal>
    );
}

export default ItemGamesHistory;

const LoadingState = styled.div`
    font-size: 42px;
    font-weight: bold;
    text-align: center;
    color: #ddd;
`;

export const H1 = styled.div`
    font-size: 42px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #999;
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
`;
export const Player = styled.div`
    width: 50%;
    text-align: center;
    padding-bottom: 10px;
    padding-top: 10px;
    border-bottom: 1px solid #999;
`;
export const PlayerName = styled.div`
    font-size: 30px;
    color: #ccc;
    ${(props) => props.owner && 'text-decoration: underline; color: #000;'};
`;
export const PlayerStats = styled.div`
    font-size: 42px;
    font-weight: bold;
`;
