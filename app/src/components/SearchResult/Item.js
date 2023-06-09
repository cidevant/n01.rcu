import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import useHomeInfo from '../../hooks/useHomeInfo';
import { stripAverageFromName } from '../../utils/stats';
import LongPressButton from '../LongPressButton';

export function SearchResultItem({ player, open }) {
    const { dispatchStartGame } = useHomeInfo();

    function onLongPress(event) {
        event.target.classList.add('confirmed');
        dispatchStartGame(event.target.id);
    }

    function onPressIn(event) {
        event.target.classList.add('touching');
    }

    function onPressOut(event) {
        event.target.classList.remove('confirmed');
        event.target.classList.remove('touching');
    }

    return (
        <PlayerWrapper key={player.id} className="d-flex flex-row">
            {player.average && (
                <PlayerAverage className="d-flex align-items-center">
                    {player.average}
                </PlayerAverage>
            )}
            <PlayerName
                onClick={open(player.name)}
                className="flex-grow-1 d-flex align-items-center"
            >
                {player.cam && <FontAwesomeIcon className="me-4" icon="fa-solid fa-video" />}
                {stripAverageFromName(player.name)}
            </PlayerName>
            <PlayerButtonWrapper className="d-flex align-items-center">
                <LongPressButton
                    onLongPress={onLongPress}
                    onPressOut={onPressOut}
                    onPressIn={onPressIn}
                >
                    <PlayButton id={player.id}>
                        PLAY <br />
                        <SmallText>{player.legs}</SmallText>
                    </PlayButton>
                </LongPressButton>
            </PlayerButtonWrapper>
        </PlayerWrapper>
    );
}

export default SearchResultItem;

const PlayerWrapper = styled.div`
    border-bottom: 2px solid #ccc;
    padding: 40px 40px;
    z-index: 5;
`;

const SmallText = styled.span`
    font-size: 24px;
`;

const PlayerName = styled.div`
    font-size: 44px;
    color: #444;
`;

const PlayerAverage = styled.div`
    font-size: 52px;
    margin-right: 20px;
    font-weight: bold;
`;

const PlayerButtonWrapper = styled.div``;

const PlayButton = styled.button`
    border: 0;
    background-color: green;
    color: white;
    padding: 20px;
    font-size: 30px;
    border-radius: 15px;
    font-weight: bold;
    width: 350px;
    height: 160px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    &.touching {
        background-color: #15c900;
        transition: background-color 1s;
    }

    &.confirmed {
        border-color: #fff;
        color: white;
    }
`;
