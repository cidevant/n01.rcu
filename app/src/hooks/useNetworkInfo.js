import { useSelector } from 'react-redux';

export function useNetworkInfo() {
    const wsStatus = useSelector((state) => state.ws.status);
    const clientStatus = useSelector((state) => state.client.status);
    const client = useSelector((state) => state.client.client);
    const ws = useSelector((state) => state.ws);
    const isConnected = wsStatus === WebSocket.OPEN;

    return {
        isConnected,
        isPaired: isConnected && clientStatus === 'PAIRED',
        client,
        accessCode: ws.accessCode,
        serverUrl: ws.serverUrl,
    };
}
