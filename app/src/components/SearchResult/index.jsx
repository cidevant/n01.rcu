import useHomeInfo from '../../hooks/useHomeInfo';
import styled from 'styled-components';
import useLongPress from '../../hooks/useLongPress';
import Spinner from 'react-bootstrap/Spinner';
import { useLoadingSpinner } from './hooks';
import { SearchResultItem } from './Item';

function SearchResult() {
    const { dispatchStartGame } = useHomeInfo();
    const { players } = useHomeInfo();
    const showSpinner = useLoadingSpinner();
    const longPressHandlers = useLongPress(
        (e) => {
            e.target.classList.add('ok');
            dispatchStartGame(e.target.id);
        },
        (e) => e.target.classList.remove('ok'),
        300
    );

    return (
        <div>
            {showSpinner && (
                <SpinnerWrapper>
                    <Spinner className="me-2" animation="border" size="sm" />
                </SpinnerWrapper>
            )}
            {players?.map?.((player) => (
                <SearchResultItem
                    key={player.id}
                    longPressHandlers={longPressHandlers}
                    player={player}
                />
            ))}
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
