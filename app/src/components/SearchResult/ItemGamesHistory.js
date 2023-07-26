import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { stripAverageFromName } from '../../utils/stats';
import styled from 'styled-components';
import { usePlayerGameHistory, usePlayerId } from '../../hooks/useGameHistory';
import { GamePlayerLegs as GamePlayerLegsBase } from '../GameStats/index.style';
import MatchDetailModal from '../NakkaMatchDetailModal';

function ItemGamesHistory({ playerName, close }) {
    const name = stripAverageFromName(playerName)?.trim?.();
    const userId = usePlayerId();
    const { stats, loading } = usePlayerGameHistory(name, userId);
    const [matchDetail, setMatchDetail] = useState(false);

    function openDetail(matchId) {
        return () => {
            setMatchDetail(matchId);
        };
    }

    function closeDetail() {
        setMatchDetail(false);
    }

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
                        <Wrapper key={game.mid} onClick={openDetail(game.mid)}>
                            <Player>
                                <PlayerName
                                    owner={stripAverageFromName(playerName).includes(game.p1name)}
                                >
                                    {game.p1name}
                                </PlayerName>
                                <PlayerStats>{p1Stats}</PlayerStats>
                                <GamePlayerLegs>{game.p1winLegs}</GamePlayerLegs>
                            </Player>

                            <Player>
                                <PlayerName
                                    owner={stripAverageFromName(playerName).includes(game.p2name)}
                                >
                                    {game.p2name}
                                </PlayerName>
                                <PlayerStats>{p2Stats}</PlayerStats>
                                <GamePlayerLegs second>{game.p2winLegs}</GamePlayerLegs>
                            </Player>
                        </Wrapper>
                    );
                })}
            {matchDetail !== false && <MatchDetailModal close={closeDetail} mid={matchDetail} />}
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
    position: relative;
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

const GamePlayerLegs = styled(GamePlayerLegsBase)`
    z-index: 0;
    ${({ second }) => `${second ? 'right' : 'left'}: 20px;`};
`;
