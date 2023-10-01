import React, { useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import useGameInfo from '../../hooks/useGameInfo';
import Countdown from 'react-countdown';

let timeoutId;

const exitAfter = 7000;

function ExitTimeoutModal({ close }) {
    const { dispatchExitGame } = useGameInfo();
    const exitAt = useRef(Date.now() + exitAfter);

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
        if (timeoutId == null) {
            timeoutId = setTimeout(() => {
                dispatchExitGame();
                stopTimer();
                close();
            }, exitAfter);
        }
    }, [close, dispatchExitGame]);

    return (
        <Modal dialogClassName="XL_MODAL" show fullscreen={false} onHide={closeModal}>
            <Wrapper>
                <Title>
                    Exit after <br />
                    {
                        <Countdown
                            date={exitAt.current}
                            intervalDelay={30}
                            precision={1}
                            renderer={(props) => <>{(props.total / 1000).toFixed(1)}</>}
                        />
                    }
                    <br />
                    seconds
                </Title>

                <ButtonWrapper onClick={exit}>
                    <Button variant="success" size="lg">
                        EXIT NOW
                    </Button>
                </ButtonWrapper>
                <ButtonWrapper onClick={closeModal}>
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
