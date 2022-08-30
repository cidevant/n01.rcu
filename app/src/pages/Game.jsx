import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useGameInfo } from '../hooks/useGameInfo';
import { useNavigate } from 'react-router-dom';
import useLongPress from '../hooks/useLongPress';
import { FinishDartsModal } from '../components/FinishDartsModal';

const zeroRow = ['-', 0, '-'];
const highlightedScores = [60, 100, 140];
const scores = [
    [26, 58, 43],
    [45, 60, 41],
    [85, 100, 81],
    [95, 98, 83],
    [30, 39, 22],
    [35, 11, 24],
    [40, 80, 140],
];

function Game() {
    const navigate = useNavigate();
    const [showFinishDarts, setShowFinishDarts] = useState(false);
    const { gameStarted, dispatchInputScore, finishDarts, scoreLeft } = useGameInfo();
    const longPressHandlers = useLongPress(
        (e) => {
            e.target.classList.add('ok');
            dispatchInputScore(parseInt(e.target.id, 10));
        },
        (e) => e.target.classList.remove('ok')
    );

    function closeFinishDartsModal() {
        setShowFinishDarts(false);
    }

    const scoresList = useMemo(() => {
        const result = [...scores];

        if (scoreLeft <= 180) {
            result.unshift(zeroRow);
            result.push(zeroRow);
        }

        return result;
    }, [scoreLeft]);

    // End of game
    useEffect(() => {
        if (!gameStarted) {
            navigate('/');
        }
    }, [navigate, gameStarted]);

    // Finish darts
    useEffect(() => {
        if (finishDarts?.length > 0) {
            setShowFinishDarts(true);
        }
    }, [finishDarts, showFinishDarts, setShowFinishDarts]);

    return (
        <>
            <Table>
                <tbody>
                    {scoresList.map((row, index1) => {
                        return (
                            <TableRow key={index1}>
                                {row.map((num, index2) => {
                                    return (
                                        <TableCell key={index2}>
                                            {!isNaN(num) && (
                                                <Button
                                                    id={num}
                                                    isZero={num === 0}
                                                    isHighlighted={highlightedScores.includes(num)}
                                                    {...longPressHandlers}
                                                >
                                                    {num}
                                                </Button>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </tbody>
            </Table>
            <FinishDartsModal show={showFinishDarts} close={closeFinishDartsModal} />
        </>
    );
}

export default Game;

const Table = styled.table`
    width: 100%;
    padding: 10px;
`;

const TableRow = styled.tr`
    width: 100%;
`;

const TableCell = styled.td`
    width: 33%;
    border: 14px solid transparent;
`;

const Button = styled.button`
    color: black;
    background-color: #eee;
    border: 2px solid #aaa;
    box-shadow: 2px 2px 6px 1px #666;
    width: 100%;
    font-size: 140px;
    padding: 20px 0;
    display: block;
    text-align: center;
    opacity: 1;
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    font-weight: bolder;

    ${({ isZero }) => {
        if (isZero) {
            return 'background-color: red; border-color: #b30000; color: white;';
        }
    }}

    ${({ isHighlighted }) => {
        if (isHighlighted) {
            // return 'background-color: #ccf2ff; border-color: #4dd2ff;';
            return 'background-color: #ddffcc; border-color: #4ce600;';
        }
    }}

    &.ok {
        background-color: #ccff33;
        border-color: #99cc00;
        color: black;
    }
`;
