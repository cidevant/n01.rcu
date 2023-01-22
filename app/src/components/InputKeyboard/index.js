import React from 'react';
import styled from 'styled-components';
import { validInputValue } from '../../utils/game';
import { useDispatch } from 'react-redux';
import { sendInputScore } from '../../store/game.reducer';
import { Sticky } from '../Sticky';
import ScoreLeft from './ScoreLeft';
import Scenes from './Scenes';
import { useGameInfo } from '../../hooks/useGameInfo';
import { useOpponentAverage } from './hooks';
import useData from '../../hooks/useData';

export function InputKeyboard() {
    const dispatch = useDispatch();
    const { game } = useData();
    const { average } = useOpponentAverage(game?.opponent?.name?.trim?.());
    const { scoreLeft, currentPlayer, playerIndex } = useGameInfo();

    function onSubmit(e) {
        const { value } = e.target;

        if (e.key === 'Enter') {
            if (validInputValue(value, scoreLeft) && currentPlayer === playerIndex) {
                dispatch(sendInputScore(value));
                e.target.value = '';
                e.target.blur();
            } else {
                e.target.classList.add('error');
                setTimeout(() => {
                    e.target.classList.remove('error');
                }, 100);
            }
        }
    }

    return (
        <Sticky bottom>
            <Scenes opponent={game?.opponent} average={average} />
            <StyledInput
                type="number"
                onKeyDown={onSubmit}
                min={0}
                max={180}
                maxLength={3}
                minLength={1}
            />
            <ScoreLeft />
        </Sticky>
    );
}

export default InputKeyboard;

const StyledInput = styled.input`
    border: 0;
    width: 100%;
    height: 100%;
    background-color: #111;
    font-size: 120px;
    padding: 20px 0;
    text-align: center;
    color: white;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &[type='number'] {
        -moz-appearance: textfield;
    }

    &.error {
        background-color: red;
    }
`;
