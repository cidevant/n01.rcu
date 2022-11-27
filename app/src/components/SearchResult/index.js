import useHomeInfo from '../../hooks/useHomeInfo';
import styled from 'styled-components';
import Spinner from 'react-bootstrap/Spinner';
import { useLoadingSpinner } from './hooks';
import { SearchResultItem } from './Item';
import { useState } from 'react';
import ItemGamesHistory from './ItemGamesHistory';

function SearchResult() {
    const { players } = useHomeInfo();
    const showSpinner = useLoadingSpinner();
    const [playerGamesHistory, setPlayerGamesHistory] = useState(false);

    function closePlayerGamesHistory() {
        setPlayerGamesHistory(false);
    }

    function openPlayerGamesHistory(playerName) {
        return () => {
            setPlayerGamesHistory(playerName);
        };
    }

    return (
        <div>
            {showSpinner && (
                <SpinnerWrapper>
                    <Spinner className="me-2" animation="border" size="sm" />
                </SpinnerWrapper>
            )}
            {players?.map?.((player) => (
                <SearchResultItem key={player.id} player={player} open={openPlayerGamesHistory} />
            ))}

            <ItemGamesHistory close={closePlayerGamesHistory} playerName={playerGamesHistory} />
        </div>
    );
}

export default SearchResult;

const spinnerSize = 300;
const SpinnerWrapper = styled.div`
    position: absolute;
    right: calc(50% - ${spinnerSize / 2}px);
    top: calc(50% - ${spinnerSize / 2}px);
    z-index: 4;

    & > .spinner-border {
        width: ${spinnerSize}px;
        height: ${spinnerSize}px;
        border: ${spinnerSize / 5}px solid #999;
        opacity: 0.2;
        border-right-color: transparent;
    }
`;
