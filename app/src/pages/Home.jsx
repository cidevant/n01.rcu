import React, { useEffect, useRef } from 'react';
import { useGameInfo } from '../hooks/useGameInfo';
import { useNavigate } from 'react-router-dom';
import useHomeInfo from '../hooks/useHomeInfo';
import styled from 'styled-components';
import useLongPress from '../hooks/useLongPress';

function Home() {
    const initFetch = useRef();
    const navigate = useNavigate();
    const { gameStarted } = useGameInfo();
    const { searchAvailable, players, dispatchScrollBottom, dispatchFilter, dispatchStartGame } =
        useHomeInfo();

    function stripAverageFromName(name) {
        return name.replace(/\([0-9]*\.[0-9]*\)/, '');
    }

    function refreshData() {
        dispatchFilter();
    }

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

    // Init players polling
    useEffect(() => {
        if (searchAvailable && initFetch.current == null) {
            dispatchFilter();
            initFetch.current = setInterval(() => {
                dispatchFilter();
            }, 5000);
        } else if (!searchAvailable && initFetch.current != null) {
            clearInterval(initFetch.current);
            initFetch.current = null;
        }
    }, [dispatchFilter, searchAvailable]);

    return (
        <div>
            {searchAvailable && <RefreshButton onClick={refreshData}>REFRESH</RefreshButton>}
            {searchAvailable &&
                players?.length > 0 &&
                players.reverse().map((player) => {
                    return (
                        <PlayerWrapper key={player.id} className="d-flex flex-row">
                            {player.average && (
                                <PlayerAverage className="d-flex align-items-center">
                                    {player.average}
                                </PlayerAverage>
                            )}
                            <PlayerName className="flex-grow-1 d-flex align-items-center">
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

const PlayerWrapper = styled.div`
    border-bottom: 2px solid #ccc;
    padding: 40px 40px;
`;

const PlayerName = styled.div`
    font-size: 32px;
`;

const PlayerAverage = styled.div`
    font-size: 52px;
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
