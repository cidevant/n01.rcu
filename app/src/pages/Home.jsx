import React, { useEffect, useState, useRef } from 'react';
import { useGameInfo } from '../hooks/useGameInfo';
import { useNavigate } from 'react-router-dom';
import useHomeInfo from '../hooks/useHomeInfo';
import styled from 'styled-components';

function Home() {
    const initFetch = useRef();
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

    // Fetch players
    useEffect(() => {
        if (searchAvailable && !initFetch.current) {
            dispatchFilter(filter);
            initFetch.current = true;
        }
    }, [dispatchFilter, searchAvailable, filter]);

    return (
        <div>
            {searchAvailable && (
                <ScrollBottomButton onClick={dispatchScrollBottom}>
                    SCROLL BOTTOM
                </ScrollBottomButton>
            )}
        </div>
    );
}

export default Home;

const ScrollBottomButton = styled.button`
    width: 100%;
    /* margin: 20px; */
    padding: 20px;
    border: 0;
    height: 400px;
    font-size: 100px;
`;
