import React from 'react';
import { useDispatch } from 'react-redux';
import { sendInputScore } from '../store/game.reducer';

function Home() {
    const dispatch = useDispatch();

    function sendText() {
        dispatch(sendInputScore(20));
    }

    return (
        <>
            <div>HELLO</div>
            <div>
                <button onClick={sendText} className="btn btn-primary">
                    MY NAME
                </button>
            </div>
        </>
    );
}

export default Home;
