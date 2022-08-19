import { useSelector } from 'react-redux';

export function useNetworkInfo() {
    const wsStatus = useSelector((state) => state.ws.status);
    const clientStatus = useSelector((state) => state.client.status);
    const client = useSelector((state) => state.client.client);
    const isConnected = wsStatus === WebSocket.OPEN;
    const isPaired = clientStatus === 'PAIRED';

    return [true, false, { name: 'Konstantin' }];
    // return [isConnected, isPaired, client];
}
