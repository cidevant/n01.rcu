import styled from 'styled-components';
import React, { useRef } from 'react';
import { validInputValue } from '../../../utils/game';
import { useDispatch, useSelector } from 'react-redux';
import { sendInputScore } from '../../../store/game.reducer';
import { Phantom, FixPositionWrapper } from './_shared';
import CloseNumPad from './CloseNumPad';
import ScoreLeft from './ScoreLeft';

export function InputNumPad({ show }) {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const leftScore = useSelector((state) => state.game.scoreLeft);

    function onSubmit(e) {
        if (e.key === 'Enter') {
            const { value } = e.target;

            if (validInputValue(value, leftScore)) {
                dispatch(sendInputScore(value));
                ref.current.blur();
                e.target.value = '';
            } else {
                console.error('===================> ', value);
            }
        }
    }

    return (
        <>
            <Phantom size={200} />
            <FixPositionWrapper>
                <StyledInput
                    type="number"
                    ref={ref}
                    min={0}
                    max={180}
                    autoFocus
                    maxLength={3}
                    minLength={1}
                    onKeyDown={onSubmit}
                />
                <CloseNumPad show={show} />
                <ScoreLeft />
            </FixPositionWrapper>
        </>
    );
}

export default InputNumPad;

const StyledInput = styled.input`
    border: 0;
    width: 100%;
    height: 100%;
    background-color: #222;
    font-size: 120px;
    padding: 20px 0;
    text-align: center;
    color: white;

    *::-webkit-outer-spin-button,
    *::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    *[type='number'] {
        -moz-appearance: textfield;
    }

    &.error {
        background-color: red;
    }
`;
