import useData from '../../hooks/useData';
import SearchResults from '../../components/SearchResult';
import { useStartGameWatcher, useSearchPolling, useStats } from './hooks';
import Idle from './Idle';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';
import WaitingForPairing from './WaitingForPairing';
import ConnectForm from './ConnectForm';
import TopBar from '../../components/TopBar';
import ScenesModal from '../../components/ScenesModal';

function Home() {
    const { activity, page } = useData();
    const { isConnected, isPaired } = useNetworkInfo();

    useStartGameWatcher(page);
    useSearchPolling(activity);
    useStats();

    function renderContent() {
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

    return (
        <>
            <TopBar />
            {renderContent()}
            <ScenesModal show={true} close={() => {}} />
        </>
    );
}

export default Home;
