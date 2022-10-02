import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useHomeInfo from '../../hooks/useHomeInfo';

export function ClientStatsModal({ show, close }) {
    const { stats } = useHomeInfo();

    return (
        <Offcanvas placement="start" show={show} onHide={close}>
            STATS
        </Offcanvas>
    );
}

export default ClientStatsModal;

const ButtonWrapper = styled.div`
    height: 150px;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.4);
    z-index: 10;

    & > button {
        border-radius: 0;
        font-size: 80px;
    }
`;
