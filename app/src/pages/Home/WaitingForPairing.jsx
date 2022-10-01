import React from 'react';
import { Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';

function WaitingForPairing() {
    const { accessCode } = useNetworkInfo();

    return (
        <FullHeight>
            <Title>client pairing code</Title>
            <AccessCode variant="success">{accessCode}</AccessCode>
        </FullHeight>
    );
}

export default WaitingForPairing;

const FullHeight = styled.div`
    margin-top: 100px;
    padding: 40px;
    padding-top: 0;
`;

const Title = styled.div`
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 100px;
    color: #555;
`;

const AccessCode = styled(Alert)`
    text-align: center;
    text-transform: uppercase;
    font-size: 8rem;
    padding: 60px;
`;
