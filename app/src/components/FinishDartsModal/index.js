import { useState, useCallback, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { useGameInfo } from '../../hooks/useGameInfo';

const i18n = {
    finish_first: '1ST DART',
    finish_second: '2ND DART',
    finish_third: '3RD DART',
};

export function FinishDartsModal() {
    const { finishDarts, dispatchSetFinishDarts } = useGameInfo();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (finishDarts?.length > 0) {
            setShow(true);
        }
    }, [finishDarts, setShow]);

    function close() {
        setShow(false);
    }

    function setFinishDarts(e) {
        const value = e.target.id;

        dispatchSetFinishDarts(value);
        close();
    }

    return (
        <Modal show={show} fullscreen backdrop="static" onHide={close}>
            <Header className="d-flex align-items-center justify-content-center">
                FINISH DARTS
            </Header>
            <Content>
                {finishDarts?.map((dart) => {
                    return (
                        <OptionWrapper key={`${dart}`}>
                            <Option
                                onClick={setFinishDarts}
                                id={dart}
                                variant="info"
                                className="d-flex align-items-center justify-content-center"
                            >
                                {i18n[dart] ?? '-'}
                            </Option>
                        </OptionWrapper>
                    );
                })}
                <OptionWrapper key="finish_cancel">
                    <Option
                        onClick={setFinishDarts}
                        id="finish_cancel"
                        variant="danger"
                        className="d-flex align-items-center justify-content-center"
                    >
                        Cancel
                    </Option>
                </OptionWrapper>
            </Content>
        </Modal>
    );
}

export default FinishDartsModal;

const Header = styled.div`
    height: 150px;
    background-color: #3fc864;
    text-align: center;
    font-weight: bold;
    color: #333;
    font-size: 100px;
`;

const Content = styled.div`
    height: 100%;
    padding: 20px;
`;

const OptionWrapper = styled.div`
    height: 25%;
`;

const Option = styled.div`
    font-size: 120px;
    height: 100%;
    margin: 20px;
    color: #0f5132;
    background-color: #d1e7dd;
    border: 2px solid #badbcc;
`;
