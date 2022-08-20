import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';

export function CheckoutsModal({ show, close, scoreLeft, checkouts }) {
    return (
        <Offcanvas placement="end" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">
                <Button size="lg" onClick={close}>
                    {scoreLeft} CHECKOUTS
                </Button>
            </ButtonWrapper>
            <Checkouts checkouts={checkouts} />
        </Offcanvas>
    );
}

function Checkouts({ checkouts }) {
    return (
        <ContentWrapper>
            {checkouts.map((checkout) => {
                return (
                    <CheckoutsRow className="d-flex gap-5">
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

    & > button {
        border-radius: 0;
        font-size: 80px;
        border: 0;
    }
`;

const ContentWrapper = styled.div`
    padding: 20px;
`;

const CheckoutsRow = styled.div`
    padding: 20px;
`;

const CheckoutDart = styled.div`
    font-size: 70px;
    background-color: #b6effb;
    border: 1px solid #004757;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2);
    padding: 5px 15px;
    color: #004757;
    border-radius: 10px;
`;
