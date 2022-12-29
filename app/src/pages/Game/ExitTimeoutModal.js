import React, { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import useGameInfo from '../../hooks/useGameInfo';
import Countdown from 'react-countdown';

let timeoutId;

const exitAfter = 2000;

function ExitTimeoutModal({ show, close }) {
    const { dispatchExitGame } = useGameInfo();

    function stopTimer() {
        if (timeoutId != null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    function exit() {
        dispatchExitGame();
    }

    function closeModal() {
        stopTimer();
        close();
    }

    useEffect(() => {
        if (show === true) {
            stopTimer();

            timeoutId = setTimeout(() => {
                dispatchExitGame();
                stopTimer();
                close();
            }, exitAfter);
        } else {
            stopTimer();
        }

        return () => {
            stopTimer();
        };
    }, [show, dispatchExitGame, close]);

    return (
        <Modal dialogClassName="XL_MODAL" show={show} fullscreen={false} onHide={closeModal}>
            <Wrapper>
                <Title>
                    Exit after <br />
                    <Countdown
                        date={Date.now() + exitAfter}
                        intervalDelay={10}
                        precision={3}
                        renderer={(props) => <>{props.total / 1000}</>}
                    />
                    <br />
                    seconds
                </Title>

                <ButtonWrapper onClick={exit}>
                    <Button variant="success" size="lg">
                        EXIT
                    </Button>
                </ButtonWrapper>
                <ButtonWrapper onClick={close}>
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
    margin-bottom: 100px;
`;
