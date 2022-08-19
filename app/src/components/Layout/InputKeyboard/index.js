import React, { useState } from 'react';
import styled from 'styled-components';
import Icon from '../../../assets/icons/numpad.png';

export function InputKeyboard() {
    const [showInput, setShowInput] = useState(false);

    return <div>{showInput ? <PhantomInput /> : <KeyboardIcon />}</div>;
}

function KeyboardIcon() {
    return (
        <FixPositionWrapper className="p-5 d-flex justify-content-end w-100">
            <IconWrapper className="d-flex align-items-center justify-content-center">
                <IconImage src={Icon} />
            </IconWrapper>
        </FixPositionWrapper>
    );
}

function PhantomInput() {
    return (
        <>
            <Phantom />
            <FixPositionWrapper>
                <StyledInput type="number" className="error" maxLength={3} minLength={1} />
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
