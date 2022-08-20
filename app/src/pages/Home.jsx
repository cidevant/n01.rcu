import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useGameInfo } from '../hooks/useGameInfo';
import { sendInputScore } from '../store/game.reducer';
import { validInputValue } from '../utils/game';

const scores = [
    [26, 58, 43],
    [45, 60, 41],
    [85, 100, 81],
    [95, 98, 83],

    // [26, 58, 43],
    // [45, 60, 41],
    // [85, 100, 81],
    // [95, 98, 83],
    // [26, 58, 43],
    // [45, 60, 41],
    // [85, 100, 81],
    // [95, 98, 83],
];

function Home() {
    const dispatch = useDispatch();
    const { scoreLeft } = useGameInfo();

    function sendScore(event) {
        const val = event.target.id;

        if (validInputValue(val, scoreLeft)) {
            dispatch(sendInputScore(val));
        }
    }

    return (
        <Table>
            <tbody>
                {scores.map((row, indx) => {
                    return (
                        <TableRow key={indx}>
                            {row.map((num, indx2) => {
                                return (
                                    <TableCell key={indx2}>
                                        <Button id={num} onClick={sendScore}>
                                            {num}
                                        </Button>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            </tbody>
        </Table>
    );
}

export default Home;

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
    color: white;
    background-color: #666;
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
    border: 4px solid #222;
    box-shadow: 2px 2px 6px 4px rgba(0, 0, 0, 0.7);

    &:active {
        opacity: 0.8;
        background-color: #999;
        box-shadow: none;
    }
`;
