import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

export function RightSideActionsOffcanvas({ show, close }) {
    return (
        <Offcanvas placement="end" show={show} onHide={close}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                Some text as placeholder. In real life you can have the elements you have chosen.
                Like, text, images, lists, etc.
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default RightSideActionsOffcanvas;
