import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

export function SearchResultItem({ player, longPressHandlers }) {
    return (
        <PlayerWrapper key={player.id} className="d-flex flex-row">
            {player.average && (
                <PlayerAverage className="d-flex align-items-center">
                    {player.average}
                </PlayerAverage>
            )}
            <PlayerName className="flex-grow-1 d-flex align-items-center">
                {player.cam && <FontAwesomeIcon className="me-4" icon="fa-solid fa-video" />}
                {stripAverageFromName(player.name)}
            </PlayerName>
            <PlayerButtonWrapper className="d-flex align-items-center">
                <PlayButton id={player.id} {...longPressHandlers}>
                    PLAY <br />
                    <SmallText>{player.legs}</SmallText>
                </PlayButton>
            </PlayerButtonWrapper>
        </PlayerWrapper>
    );
}

export default SearchResultItem;

function stripAverageFromName(name) {
    return name.replace(/\([0-9]*\.[0-9]*\)/, '');
}

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
`;

const PlayerAverage = styled.div`
    font-size: 32px;
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
    width: 250px;
    height: 130px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    &.ok {
        background-color: #ccff33;
        border-color: #99cc00;
        color: black;
    }
`;
