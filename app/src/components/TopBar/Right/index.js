import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';
import SettingsModal from '../../SettingsModal';
import { CornerButton } from '../CornerButton';

export function RightButtons() {
    const [show, setShow] = useState(false);

    function onShow() {
        setShow(true);
    }
    function onClose() {
        setShow(false);
    }

    return (
        <>
            <SettingsButton open={onShow} />
            <SettingsModal show={show} close={onClose} />
        </>
    );
}

export default RightButtons;

function SettingsButton({ open }) {
    const color = '#6c757d';

    return (
        <div className="d-flex align-items-center">
            <div className="ms-4">
                <Button color={color} onClick={open}>
                    <FontAwesomeIcon icon="fa-solid fa-user-gear" />
                </Button>
            </div>
        </div>
    );
}

export const Button = styled(CornerButton)`
    & > i {
        font-size: 100px;
    }

    & > div {
        width: 80px;
        height: 80px;
        border-width: 10px;
    }

    & > svg {
        width: 60px;
        height: 60px;
    }
`;
