import React from 'react';
import { useDispatch } from 'react-redux';
import { sendInputScore } from '../store/game.reducer';
import { connect, disconnect } from '../store/ws.reducer';

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

    function removeAndDisconnect() {
        localStorage.removeItem('accessCode');

        dispatch(disconnect());
    }

    return (
        <div>
            <button onClick={sendScore} className="btn btn-primary">
                SEND SCORE 20
            </button>
            <button onClick={setAccessCodeAndConnect} className="btn btn-primary">
                CONNECT
            </button>
            <button onClick={removeAndDisconnect} className="btn btn-primary">
                DISCONNECT
            </button>
        </div>
    );
}

export default Home;
