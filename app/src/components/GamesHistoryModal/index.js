import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Alert, Button, Offcanvas } from 'react-bootstrap';
import styled from 'styled-components';
import useHomeInfo from '../../hooks/useHomeInfo';
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
    const [showGameInfoModal, setShowGameInfoModal] = useState(false);

    function openGameInfo(mid) {
        return () => {
            setShowGameInfoModal(mid);
        };
    }

    function closeModal() {
        setShowGameInfoModal(false);
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
                    const p1Stats = ((game.p1allScore / game.p1allDarts) * 3).toFixed(2);
                    const p2Stats = ((game.p2allScore / game.p2allDarts) * 3).toFixed(2);
                    const p1Winner = game.p1winLegs > game.p2winLegs;
                    const p2Winner = game.p2winLegs > game.p1winLegs;

                    return (
                        <GameInfo key={game.mid} onClick={openGameInfo(game.mid)}>
                            <GamePlayer>
                                <GamePlayerLegs>{game.p1winLegs}</GamePlayerLegs>
                                <GamePlayerName winner={p1Winner}>{game.p1name}</GamePlayerName>
                                <GamePlayerStats>{p1Stats}</GamePlayerStats>
                            </GamePlayer>

                            <GamePlayer>
                                <GamePlayerLegs second>{game.p2winLegs}</GamePlayerLegs>
                                <GamePlayerName winner={p2Winner}>{game.p2name}</GamePlayerName>
                                <GamePlayerStats>{p2Stats}</GamePlayerStats>
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
