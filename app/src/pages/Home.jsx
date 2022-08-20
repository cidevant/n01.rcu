import React, { useEffect } from 'react';
import { useGameInfo } from '../hooks/useGameInfo';
import { useNavigate } from 'react-router-dom';
import { useNetworkInfo } from '../hooks/useNetworkInfo';

function Home() {
    const { match } = useGameInfo();
    const navigate = useNavigate();
    const [isConnected, isPaired] = useNetworkInfo();

    // Navigate to Game page, when game started
    useEffect(() => {
        if (match != null && isConnected && isPaired) {
            navigate('/game');
        }
    }, [match, navigate, isConnected, isPaired]);

    return <div>HOME AGE</div>;
}

export default Home;
