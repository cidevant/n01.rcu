import { useSelector } from 'react-redux';

export function useNetworkInfo() {
    const wsStatus = useSelector((state) => state.ws.status);
    const clientStatus = useSelector((state) => state.client.status);
    const clientData = useSelector((state) => state.client.data);
    const ws = useSelector((state) => state.ws);
    const isConnected = wsStatus === WebSocket.OPEN;

    return {
        isConnected,
        isPaired: isConnected && clientStatus === 'PAIRED',
        client: clientData?.player?.playerName
            ? {
                  name: clientData?.player?.playerName,
              }
            : null,
        accessCode: ws.accessCode,
        serverUrl: ws.serverUrl,
    };
}
