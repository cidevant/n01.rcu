import React, { createContext } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { updateChatLog } from './actions';

const WebsocketContext = createContext(null);
const WebsocketProvider = ({ children }) => {
    let socket;
    let ws;

    const dispatch = useDispatch();
    // const sendMessage = (roomId, message) => {
    //     const payload = {
    //         roomId: roomId,
    //         data: message,
    //     };

    //     socket.emit('event://send-message', JSON.stringify(payload));
    //     dispatch(updateChatLog(payload));
    // };

    if (!socket) {
        socket = io.connect('http://localhost:3000/ws');

        // socket.on('event://get-message', (msg) => {
        //     const payload = JSON.parse(msg);

        //     dispatch(updateChatLog(payload));
        // });

        ws = {
            socket: socket,
            sendMessage,
        };
    }

    return <WebsocketContext.Provider value={ws}>{children}</WebsocketContext.Provider>;
};

export default WebsocketProvider;
export { WebsocketContext, WebsocketProvider };
