import React, { useState, useRef, useEffect } from 'react';
import { validInputValue } from '../../../utils/game';
import styled from 'styled-components';
import Icon from '../../../assets/icons/numpad.png';
import { sendInputScore } from '../../../store/game.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function InputKeyboard() {
    const [showInput, setShowInput] = useState(true);

    return showInput ? <PhantomInput show={setShowInput} /> : <NumPadIcon show={setShowInput} />;
}

function NumPadIcon({ show }) {
    function onClick() {
        show(true);
    }

    return (
        <FixPositionWrapper className="p-5 d-flex justify-content-end w-100">
            <IconWrapper
                className="d-flex align-items-center justify-content-center"
                onClick={onClick}
            >
                <IconImage src={Icon} />
            </IconWrapper>
        </FixPositionWrapper>
    );
}

function CloseKeyboardIcon({ show }) {
    return (
        <CloseIconWrapper className="d-flex align-items-center justify-content-center">
            {/* <FontAwesomeIcon icon="fa-solid fa-xmark text-white" /> */}
        </CloseIconWrapper>
    );
}

const CloseIconWrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    color: white;
    background-color: red;
    height: 100%;
    width: 100px;
`;

function PhantomInput({ show }) {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const [inputValue, setInputValue] = useState();
    const leftScore = useSelector((state) => state.game.scoreLeft);

    function onChange(e) {
        e.preventDefault();

        const { value } = e.target;

        if (validInputValue(value, leftScore)) {
            setInputValue(value);
        }
    }

    function onSubmit(e) {
        if (e.key === 'Enter') {
            const value = inputValue;

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
            <Phantom />
            <FixPositionWrapper>
                <StyledInput
                    type="number"
                    ref={ref}
                    min={0}
                    max={180}
                    autoFocus
                    maxLength={3}
                    minLength={1}
                    onChange={onChange}
                    onKeyDown={onSubmit}
                />
                <CloseKeyboardIcon show={show} />
            </FixPositionWrapper>
        </>
    );
}

export default InputKeyboard;

const Phantom = styled.div`
    display: block;
    height: 200px;
    width: 100%;
`;

const FixPositionWrapper = styled.div`
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
`;

const IconWrapper = styled.div`
    width: 200px;
    height: 200px;
    background-color: #222;
    border-radius: 100px;
    color: white;
    cursor: pointer !important;
`;

const IconImage = styled.img`
    width: 100px;
    height: 100px;
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
