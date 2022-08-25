import React, { useEffect } from 'react';
import { useGameInfo } from '../hooks/useGameInfo';
import { useNavigate } from 'react-router-dom';
import useHomeInfo from '../hooks/useHomeInfo';
import styled from 'styled-components';
import useLongPress from '../hooks/useLongPress';
import useInterval from '../hooks/useInterval';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Home() {
    // const fetchPolling = useRef();
    const navigate = useNavigate();
    const { gameStarted } = useGameInfo();
    const { searchAvailable, players, dispatchFilter, dispatchScrollBottom, dispatchStartGame } =
        useHomeInfo();

    function scrollBottom() {
        dispatchScrollBottom();
    }

    // Starts game
    const longPressHandlers = useLongPress(
        (e) => {
            e.target.classList.add('ok');
            dispatchStartGame(e.target.id);
        },
        (e) => e.target.classList.remove('ok')
    );

    // Navigate to Game page, when game started
    useEffect(() => {
        if (gameStarted) {
            navigate('/game');
        }
    }, [navigate, gameStarted]);

    // Start polling for player list
    useInterval(() => {
        if (searchAvailable) {
            dispatchFilter();
        }
    }, 5000);

    return (
        <div>
            {searchAvailable && <RefreshButton onClick={scrollBottom}>SCROLL BOTTOM</RefreshButton>}
            {searchAvailable &&
                players?.length > 0 &&
                players.map((player) => {
                    return (
                        <PlayerWrapper key={player.id} className="d-flex flex-row">
                            {player.average && (
                                <PlayerAverage className="d-flex align-items-center">
                                    {player.average}
                                </PlayerAverage>
                            )}
                            <PlayerName className="flex-grow-1 d-flex align-items-center">
                                {player.cam && (
                                    <FontAwesomeIcon className="me-2" icon="fa-solid fa-video" />
                                )}
                                {stripAverageFromName(player.name)}
                            </PlayerName>
                            <PlayerButtonWrapper className="d-flex align-items-center">
                                <PlayButton id={player.id} {...longPressHandlers}>
                                    PLAY
                                </PlayButton>
                            </PlayerButtonWrapper>
                        </PlayerWrapper>
                    );
                })}
        </div>
    );
}

export default Home;

function stripAverageFromName(name) {
    return name.replace(/\([0-9]*\.[0-9]*\)/, '');
}

const PlayerWrapper = styled.div`
    border-bottom: 2px solid #ccc;
    padding: 40px 40px;
`;

const PlayerName = styled.div`
    font-size: 32px;
`;

const PlayerAverage = styled.div`
    font-size: 32px;
    margin-right: 20px;
    font-weight: bold;
`;

const PlayerButtonWrapper = styled.div``;

const PlayButton = styled.button`
    border: 0;
    background-color: green;
    color: white;
    padding: 20px;
    font-size: 30px;
    border-radius: 15px;
    font-weight: bold;
    width: 200px;
    height: 130px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    &.ok {
        background-color: #ccff33;
        border-color: #99cc00;
        color: black;
    }
`;

const RefreshButton = styled.button`
    width: 100%;
    padding: 20px;
    border: 0;
    height: 100px;
    font-size: 40px;
`;
