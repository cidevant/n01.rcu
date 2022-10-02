import useData from '../../hooks/useData';
import SearchResults from '../../components/SearchResult';
import { useStartGameWatcher, useSearchPolling, useStats } from './hooks';
import Idle from './Idle';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';
import WaitingForPairing from './WaitingForPairing';
import ConnectForm from './ConnectForm';

function Home() {
    const { activity } = useData();
    const { isConnected, isPaired } = useNetworkInfo();

    useStartGameWatcher(activity);
    useSearchPolling(activity);
    useStats();

    if (activity === 'search') {
        return <SearchResults />;
    }

    if (isConnected && !isPaired) {
        return <WaitingForPairing />;
    }

    if (isPaired && activity === 'idle') {
        return <Idle />;
    }

    return <ConnectForm />;
}

export default Home;
