import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import useHomeInfo from '../../hooks/useHomeInfo';
import { GameInfoModal } from './GameDetailModal';
import {
    GameInfo,
    GamePlayer,
    GamePlayerLegs,
    GamePlayerName,
    GamePlayerStats,
} from './index.style';

export function GamesList() {
    const { games } = useHomeInfo();
    const [showGameInfoModal, setShowGameInfoModal] = useState(false);

    if (!games || games?.length === 0) {
        return <Alert>No games</Alert>;
    }

    function openGameInfo(mid) {
        return () => {
            setShowGameInfoModal(mid);
        };
    }

    function closeModal() {
        setShowGameInfoModal(false);
    }

    return (
        <div>
            <GameInfoModal
                show={showGameInfoModal !== false}
                mid={showGameInfoModal}
                close={closeModal}
            />
            {games.map((game) => {
                const p1Stats = ((game.p1allScore / game.p1allDarts) * 3).toFixed(2);
                const p2Stats = ((game.p2allScore / game.p2allDarts) * 3).toFixed(2);
                const p1Winner = game.p1winLegs > game.p2winLegs;
                const p2Winner = game.p2winLegs > game.p1winLegs;

                return (
                    <GameInfo key={game.mid} onClick={openGameInfo(game.mid)}>
                        <GamePlayer winner={p1Winner}>
                            <GamePlayerLegs>{game.p1winLegs}</GamePlayerLegs>
                            <GamePlayerName>{game.p1name}</GamePlayerName>
                            <GamePlayerStats>{p1Stats}</GamePlayerStats>
                        </GamePlayer>

                        <GamePlayer winner={p2Winner}>
                            <GamePlayerLegs second>{game.p2winLegs}</GamePlayerLegs>
                            <GamePlayerName>{game.p2name}</GamePlayerName>
                            <GamePlayerStats>{p2Stats}</GamePlayerStats>
                        </GamePlayer>
                    </GameInfo>
                );
            })}
        </div>
    );
}
