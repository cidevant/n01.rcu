import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { validInputValue } from '../../../utils/game';
import { useDispatch, useSelector } from 'react-redux';
import { sendInputScore } from '../../../store/game.reducer';
import { StickyPhantom, Sticky } from '../Sticky';
import ScoreLeft from './ScoreLeft';
import useScroll from '../../../hooks/useScroll';

export function InputNumPad() {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const leftScore = useSelector((state) => state.game.scoreLeft);
    const scrolled = useScroll();

    function onSubmit(e) {
        const { value } = e.target;

        if (e.key === 'Enter' && validInputValue(value, leftScore)) {
            dispatch(sendInputScore(value));
            e.target.value = '';
        }
    }

    useEffect(() => {
        ref.current.blur();
    }, [scrolled]);

    return (
        <>
            <StickyPhantom size={180} />
            <Sticky bottom>
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
                <ScoreLeft />
            </Sticky>
        </>
    );
}

export default InputNumPad;

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
