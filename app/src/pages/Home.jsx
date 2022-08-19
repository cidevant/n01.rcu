import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { sendInputScore } from '../store/game.reducer';

function Home() {
    const dispatch = useDispatch();

    function sendScore() {
        dispatch(sendInputScore(20));
    }

    return (
        <div>
            <Button onClick={sendScore}>SEND SCORE 20</Button>
        </div>
    );
}

export default Home;
