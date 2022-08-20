import styled from 'styled-components';
import { useGameInfo } from '../../../hooks/useGameInfo';

export function ScoreLeft() {
    const { scoreLeft } = useGameInfo();

    if (scoreLeft == null) {
        return;
    }

    return (
        <ScoreLeftWrapper className="d-flex align-items-center justify-content-end">
            <div>
                <ScoreLeftTitle>SCORE LEFT</ScoreLeftTitle>
                <ScoreLeftValue>{scoreLeft}</ScoreLeftValue>
            </div>
        </ScoreLeftWrapper>
    );
}

export default ScoreLeft;

const ScoreLeftWrapper = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    height: 100%;
    cursor: pointer !important;
    margin-right: 20px;
    min-width: 176px;
`;

const ScoreLeftTitle = styled.div`
    color: white;
    text-align: center;
    background-color: #444;
    top: 20px;
    position: relative;
    width: 100%;
`;

const ScoreLeftValue = styled.div`
    color: white;
    font-size: 100px;
    color: #666;
    /* width: 180px; */
    text-align: center;
`;
