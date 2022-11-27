import React from 'react';
import { Modal } from 'react-bootstrap';

function ItemGamesHistory({ playerName, close }) {
    return (
        <Modal
            dialogClassName="XL_MODAL"
            show={playerName !== false}
            fullscreen={false}
            onHide={close}
        >
            {playerName}
        </Modal>
    );
}

export default ItemGamesHistory;
