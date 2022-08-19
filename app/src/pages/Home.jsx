import React from 'react';
import { useDispatch } from 'react-redux';
import { sendInputScore } from '../store/game.reducer';
import { connect } from '../store/ws.reducer';

function Home() {
    const dispatch = useDispatch();

    function sendScore() {
        dispatch(sendInputScore(20));
    }

    function setAccessCodeAndConnect() {
        const accessCode = 'TEST';

        localStorage.setItem('accessCode', accessCode);

        dispatch(connect(accessCode));
    }

    return (
        <>
            <div>HELLO</div>
            <div>
                <button onClick={sendScore} className="btn btn-primary">
                    INPUT SCORE
                </button>
                <button onClick={setAccessCodeAndConnect} className="btn btn-primary">
                    CONNECT
                </button>
            </div>
        </>
    );
}

export default Home;
