import React, { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import useGameInfo from '../../hooks/useGameInfo';

let timeoutId;

function ExitTimeoutModal({ show, close }) {
    const { dispatchExitGame } = useGameInfo();

    function stopTimer() {
        if (timeoutId != null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    useEffect(() => {
        if (show === true) {
            stopTimer();

            timeoutId = setTimeout(() => {
                dispatchExitGame();
                stopTimer();
                close();
            }, 2000);
        } else {
            stopTimer();
        }

        return () => {
            stopTimer();
        };
    }, [show, dispatchExitGame, close]);

    return (
        <Modal dialogClassName="XL_MODAL" show={show} fullscreen={false} onHide={close}>
            <Wrapper onClick={close}>
                <Title>
                    Exit in <br /> 2 seconds
                </Title>
                <ButtonWrapper>
                    <Button variant="danger" size="lg">
                        CANCEL
                    </Button>
                </ButtonWrapper>
            </Wrapper>
        </Modal>
    );
}

export default ExitTimeoutModal;

const Wrapper = styled.div`
    padding-top: 150px;
    padding-bottom: 20px;
    width: 100%;
`;

const ButtonWrapper = styled.div`
    z-index: 10;
    margin-top: 100px;
    padding: 20px;
    width: 100%;

    & > button {
        border-radius: 0;
        font-size: 40px;
        height: 240px;
        width: 100%;
    }
`;
const Title = styled.div`
    text-align: center;

    font-size: 80px;
`;
