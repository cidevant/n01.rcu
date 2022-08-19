import React, { useState, useRef, useEffect } from 'react';
import { notGreaterThanLeftScore, validInputValue } from '../../../utils/game';
import styled from 'styled-components';
import Icon from '../../../assets/icons/numpad.png';
import { sendInputScore } from '../../../store/game.reducer';
import { useDispatch, useSelector } from 'react-redux';

export function InputKeyboard() {
    const [showInput, setShowInput] = useState(false);

    return showInput ? <PhantomInput show={setShowInput} /> : <NumPadIcon show={setShowInput} />;
}

export default InputKeyboard;

function PhantomInput({ show }) {
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
                <CloseKeyboardIcon show={show} />
                <ScoreLeft />
            </FixPositionWrapper>
        </>
    );
}

function ScoreLeft() {
    const leftScore = useSelector((state) => state.game.scoreLeft);

    if (leftScore == null) {
        return;
    }

    return (
        <ScoreLeftWrapper className="d-flex align-items-center justify-content-end">
            <div>
                <ScoreLeftTitle>SCORE LEFT</ScoreLeftTitle>
                <ScoreLeftValue>{notGreaterThanLeftScore}</ScoreLeftValue>
            </div>
        </ScoreLeftWrapper>
    );
}

function CloseKeyboardIcon({ show }) {
    function hide() {
        show(false);
    }

    return (
        <CloseIconWrapper
            onClick={hide}
            className="d-flex align-items-center justify-content-center"
        >
            <i className="bi bi-x-circle"></i>
        </CloseIconWrapper>
    );
}

function NumPadIcon({ show }) {
    function onClick() {
        setTimeout(() => {
            show(true);
        }, 200);
    }

    return (
        <>
            <Phantom size={200} />
            <FixPositionWrapper className="p-5 d-flex justify-content-end w-100">
                <NumPadIconWrapper
                    className="d-flex align-items-center justify-content-center"
                    onClick={onClick}
                >
                    <NumPadIconImage src={Icon} />
                </NumPadIconWrapper>
            </FixPositionWrapper>
        </>
    );
}

const Phantom = styled.div`
    display: block;
    height: ${({ size }) => `${size ?? 200}px`};
    width: 100%;
`;

const FixPositionWrapper = styled.div`
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
`;

const NumPadIconWrapper = styled.button`
    width: 150px;
    height: 150px;
    background-color: #222;
    border-radius: 75px;
    box-shadow: 0px 15px 20px 0px rgba(0, 0, 0, 0.5);
    border: 0;
    color: #fff;
    cursor: pointer !important;
    transition: transform ease-in-out 100ms;
    outline: none;

    &:active {
        background-color: #161616;
        transform: translate(5px, 10px);
    }
`;

const NumPadIconImage = styled.img`
    width: 150px;
    height: 150px;
`;

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

const CloseIconWrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    color: red;
    height: 100%;
    width: 160px;
    cursor: pointer !important;

    & > i {
        font-size: 140px;
    }
`;

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
