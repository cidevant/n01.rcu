import React, { useState } from 'react';
import { ScenesModal } from '../ScenesModal';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Scenes() {
    const [modalShow, setModalShow] = useState(false);

    function onShow() {
        setModalShow(true);
    }
    function onClose() {
        setModalShow(false);
    }

    return (
        <ScoreLeftWrapper>
            <ScenesButton open={onShow} />
            <ScenesModal show={modalShow} close={onClose} />
        </ScoreLeftWrapper>
    );
}

export default Scenes;

function ScenesButton({ open }) {
    return (
        <div className="d-flex align-items-center">
            <CornerButton color="#0dcaf0" onClick={open}>
                <FontAwesomeIcon icon="fa-solid fa-face-grin-squint-tears" className="text-black" />
            </CornerButton>
        </div>
    );
}

const ScoreLeftWrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    cursor: pointer !important;
`;

export const CornerButton = styled.button`
    color: white;
    background-color: ${({ color }) => color};
    display: block;
    text-align: center;
    border: 0;
    opacity: ${({ opacity = 1 }) => opacity};
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    font-weight: bolder;
    width: 150px;
    outline: none;
    height: 181px;

    &:active {
        opacity: 0.8;
        background-color: #999;
    }

    & > svg {
        width: 80px;
        height: 80px;
    }
`;
