import React, { useEffect } from 'react';
import { useGameInfo } from '../hooks/useGameInfo';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { match } = useGameInfo();
    const navigate = useNavigate();

    // Navigate to Game page, when game started
    useEffect(() => {
        if (match != null) {
            navigate('/game');
        }
    }, [match, navigate]);

    return <div>HOME AGE</div>;
}

export default Home;
