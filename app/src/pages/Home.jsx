import React, { useEffect } from 'react';
import { useGameInfo } from '../hooks/useGameInfo';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const { gameStarted } = useGameInfo();

    // Navigate to Game page, when game started
    useEffect(() => {
        if (gameStarted) {
            navigate('/game');
        }
    }, [navigate, gameStarted]);

    return <div></div>;
}

export default Home;
