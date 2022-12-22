import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Alert, Button, Offcanvas } from 'react-bootstrap';
import styled from 'styled-components';
import useHomeInfo from '../../hooks/useHomeInfo';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';
import { GameHistoryDetail } from './Detail';
import {
    GameInfo,
    GamePlayer,
    GamePlayerLegs,
    GamePlayerName,
    GamePlayerStats,
} from './index.style';

export function GamesHistoryModal({ show, close }) {
    const { games } = useHomeInfo();
    const { client } = useNetworkInfo();
    const [showGameInfoModal, setShowGameInfoModal] = useState(false);

    function openGameInfo(mid) {
        return () => {
            setShowGameInfoModal(mid);
        };
    }

    function closeModal() {
        setShowGameInfoModal(false);
    }

    /**
     * Returns game player index of Client or Opponent
     *
     * @param {boolean} isP1Client is first player client
     * @param {boolean} [isClient=true] do we request index of Client or Opponent
     * @returns {string} 'p1' or 'p2'
     */
    function getPlayerIndex(isP1Client, isClient = true) {
        if (isClient) {
            return isP1Client ? 'p1' : 'p2';
        }

        return isP1Client ? 'p2' : 'p1';
    }

    function getPlayerStats(game, allStats, index) {
        return {
            name: game[`${index}name`],
            legs: game[`${index}winLegs`],
            average: allStats[`${index}Stats`],
            winner: allStats[`${index}Winner`],
        };
    }

    function getGameStats(game) {
        const isP1Client = game.p1name === client?.name;
        const allStats = {
            p1Stats: ((game.p1allScore / game.p1allDarts) * 3).toFixed(2),
            p2Stats: ((game.p2allScore / game.p2allDarts) * 3).toFixed(2),
            p1Winner: game.p1winLegs > game.p2winLegs,
            p2Winner: game.p2winLegs > game.p1winLegs,
        };
        const clientIndex = getPlayerIndex(isP1Client, true);
        const opponentIndex = getPlayerIndex(isP1Client, false);

        return {
            clientStats: getPlayerStats(game, allStats, clientIndex),
            opponentStats: getPlayerStats(game, allStats, opponentIndex),
        };
    }

    return (
        <Offcanvas scroll={true} placement="start" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">
                <Button variant="warning">
                    <FontAwesomeIcon icon="fa-solid fa-list" className="text-black me-4" />
                    GAMES
                </Button>
            </ButtonWrapper>
            <Offcanvas.Body>
                <GameHistoryDetail
                    show={showGameInfoModal !== false}
                    mid={showGameInfoModal}
                    close={closeModal}
                />
                {(!games || games?.length === 0) && <Alert>No games</Alert>}
                {games?.map?.((game) => {
                    const { clientStats, opponentStats } = getGameStats(game);

                    return (
                        <GameInfo key={game.mid} onClick={openGameInfo(game.mid)}>
                            <GamePlayer>
                                <GamePlayerLegs winner={clientStats.winner}>
                                    {clientStats.legs}
                                </GamePlayerLegs>
                                <GamePlayerName highlight>{clientStats.name}</GamePlayerName>
                                <GamePlayerStats highlight>{clientStats.average}</GamePlayerStats>
                            </GamePlayer>

                            <GamePlayer>
                                <GamePlayerLegs winner={opponentStats.winner} second>
                                    {opponentStats.legs}
                                </GamePlayerLegs>
                                <GamePlayerName>{opponentStats.name}</GamePlayerName>
                                <GamePlayerStats>{opponentStats.average}</GamePlayerStats>
                            </GamePlayer>
                        </GameInfo>
                    );
                })}{' '}
            </Offcanvas.Body>
        </Offcanvas>
    );
}

const ButtonWrapper = styled.div`
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.4);
    z-index: 10;

    & > button {
        border-radius: 0;
        font-size: 80px;
        height: 150px;
    }
`;
