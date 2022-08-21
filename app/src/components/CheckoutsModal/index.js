import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import dartsImage from '../../assets/icons/darts_board_white.png';

export function CheckoutsModal({ show, close, scoreLeft, checkouts }) {
    return (
        <Offcanvas placement="end" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">
                <CloseButton size="lg" onClick={close} variant="secondary" className="text-white">
                    <StyledImage src={dartsImage} alt="darts board" className="me-4" />
                    CHECKOUTS
                </CloseButton>
            </ButtonWrapper>
            <ScoreLeft>{scoreLeft}</ScoreLeft>
            <Checkouts checkouts={checkouts} />
        </Offcanvas>
    );
}

function Checkouts({ checkouts }) {
    return (
        <ContentWrapper>
            {checkouts.map((checkout, index) => {
                return (
                    <CheckoutsRow key={index} className="d-flex gap-5">
                        {checkout.map((dart) => {
                            return <CheckoutDart key={dart}>{dart}</CheckoutDart>;
                        })}
                    </CheckoutsRow>
                );
            })}
        </ContentWrapper>
    );
}

export default CheckoutsModal;

const ButtonWrapper = styled.div`
    height: 150px;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.4);
    z-index: 10;
`;

const CloseButton = styled(Button)`
    background-color: #ff1493;
    border-radius: 0;
    font-size: 70px;
    border: 0;

    &:hover,
    &:active {
        background-color: #ff1493;
        opacity: 0.8;
    }
`;

const ScoreLeft = styled.div`
    text-align: center;
    font-size: 150px;
`;

const ContentWrapper = styled.div`
    padding: 20px;
    padding-top: 0;
`;

const CheckoutsRow = styled.div`
    padding: 20px;
`;

const CheckoutDart = styled.div`
    font-size: 70px;
    background-color: #ff1493;
    border: 1px solid #89004a;
    color: white;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2);
    padding: 5px 15px;
    border-radius: 10px;
    min-width: 140px;
    text-align: center;
`;

const StyledImage = styled.img`
    width: 100px;
    height: 100px;
    position: relative;
    top: -10px;
`;
