import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { config } from '../../config';
import { stripAverageFromName } from '../../utils/stats';
import styled from 'styled-components';

function ItemGamesHistory({ playerName, close }) {
    const [opponentStats, setOpponentStats] = useState();
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        if (!_.isEmpty(playerName)) {
            setLoading(true);

            fetch(
                `${
                    config.nakkaApiEndpoint
                }/n01/online/n01_history.php?cmd=history_list&skip=0&count=10&keyword=${encodeURIComponent(
                    `~${stripAverageFromName(playerName)}`
                )}`
            )
                .then((data) => data.json())
                .then((data) => {
                    setOpponentStats(
                        data.filter((game) => {
                            const name = stripAverageFromName(playerName);

                            return name.includes(game.p1name) || name.includes(game.p2name);
                        })
                    );

                    setLoading(false);
                });
        }

        return () => {
            setOpponentStats(null);
            setLoading(null);
        };
    }, [playerName]);

    return (
        <Modal
            dialogClassName="XL_MODAL"
            show={playerName !== false}
            fullscreen={false}
            onHide={close}
        >
            <H1>{playerName}</H1>

            {loading === true && <LoadingState>Loading...</LoadingState>}
            {loading === false && opponentStats?.length === 0 && (
                <LoadingState>No data</LoadingState>
            )}
            {opponentStats?.map?.((game) => {
                const p1Stats = ((game.p1allScore / game.p1allDarts) * 3).toFixed(2);
                const p2Stats = ((game.p2allScore / game.p2allDarts) * 3).toFixed(2);

                return (
                    <Wrapper>
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
