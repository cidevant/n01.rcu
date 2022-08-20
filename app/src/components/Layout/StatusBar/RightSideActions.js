import { faHandshake } from '@fortawesome/fontawesome-free-solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RightSideActionsOffcanvas } from './RightSideActionsOffcanvas';
import { useNetworkInfo } from '../../../hooks/useNetworkInfo';
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { CornerButton } from './CornerButton';

export function RightSideActions() {
    const [modalShow, setModalShow] = useState(false);

    function onShow() {
        setModalShow(true);
    }
    function onClose() {
        setModalShow(false);
    }

    return (
        <>
            <RightSideActionsButton open={onShow} />
            <RightSideActionsOffcanvas show={modalShow} close={onClose} />
        </>
    );
}

export default RightSideActions;

function RightSideActionsButton({ open }) {
    const [isConnected] = useNetworkInfo();
    const icon = useMemo(() => {
        return <FontAwesomeIcon icon="fa-solid fa-filter" />;
    }, []);

    if (!isConnected) {
        return;
    }

    const color = '#444';

    return (
        <div className="d-flex align-items-center">
            <div className="ms-4">
                <Button color={color} onClick={open}>
                    {icon}
                </Button>
            </div>
        </div>
    );
}

const Button = styled(CornerButton)`
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
