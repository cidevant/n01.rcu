import React, { useContext } from 'react';
import { WebsocketContext } from '../websocket/context';

function Home() {
    const ws = useContext(WebsocketContext);

    console.log('WS', ws);

    function sendText() {
        ws.send('MY_EVENT', { data: 'XXX' });
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
