import React, { useEffect, useState } from 'react';
import { useGameInfo } from '../hooks/useGameInfo';
import { useNavigate } from 'react-router-dom';
import useHomeInfo from '../hooks/useHomeInfo';

function Home() {
    const [searchActive, setSearchActive] = useState(false);
    const navigate = useNavigate();
    const { gameStarted } = useGameInfo();
    const {
        searchAvailable,
        filter,
        players,
        dispatchScrollBottom,
        dispatchFilter,
        dispatchStartGame,
    } = useHomeInfo();

    // Navigate to Game page, when game started
    useEffect(() => {
        if (gameStarted) {
            navigate('/game');
        }
    }, [navigate, gameStarted]);

    // Enable search
    useEffect(() => {
        if (!searchActive && searchAvailable && players.length === 0) {
            setSearchActive(true);
            dispatchFilter();
        }
    }, [searchActive, searchAvailable, players, dispatchFilter]);

    return <div></div>;
}

export default Home;
