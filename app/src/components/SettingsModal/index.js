import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';
import SearchFilterForm from '../SearchFilterForm';
import ConnectionForm from '../ConnectionForm';

export function SettingsModal({ show, close }) {
    const { isConnected, isPaired } = useNetworkInfo();

    return (
        <Offcanvas placement="end" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">
                <Button size="lg" onClick={close} variant="secondary">
                    <FontAwesomeIcon icon="fa-solid fa-user-gear" className="text-white me-4" />
                    SETTINGS
                </Button>
            </ButtonWrapper>
            {isConnected && isPaired && <SearchFilterForm />}
            <ConnectionForm />
        </Offcanvas>
    );
}

export default SettingsModal;

const ButtonWrapper = styled.div`
    height: 150px;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.4);
    z-index: 10;

    & > button {
        border-radius: 0;
        font-size: 80px;
    }
`;
