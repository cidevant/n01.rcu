import React from 'react';
import { useDispatch } from 'react-redux';
import { sendInputScore } from '../store/game.reducer';

function Home() {
    const dispatch = useDispatch();

    function sendScore() {
        dispatch(sendInputScore(20));
    }

    return <div>H</div>;
}

export default Home;
