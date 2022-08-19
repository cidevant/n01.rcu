import styled from 'styled-components';
import { useSelector } from 'react-redux';

export function ScoreLeft() {
    const leftScore = useSelector((state) => state.game.scoreLeft);

    if (leftScore == null) {
        return;
    }

    return (
        <ScoreLeftWrapper className="d-flex align-items-center justify-content-end">
            <div>
                <ScoreLeftTitle>SCORE LEFT</ScoreLeftTitle>
                <ScoreLeftValue>{leftScore}</ScoreLeftValue>
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
    width: 160px;
    cursor: pointer !important;
    margin-right: 30px;
    min-width: 180px;
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
    width: 170px;
    text-align: center;
`;
