import Button from 'react-bootstrap/Button';
import Form from './Form';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useHomeInfo from '../../hooks/useHomeInfo';

export function SearchFilterModal({ show, close }) {
    const { dispatchSetFilter } = useHomeInfo();
    const applyFormValues = useCallback(
        (filter) => {
            dispatchSetFilter(filter);
            close();
        },
        [dispatchSetFilter, close]
    );

    return (
        <Offcanvas placement="end" show={show} onHide={close}>
            <ButtonWrapper className="d-grid gap-2">
                <Button size="lg" onClick={close} variant="secondary">
                    <FontAwesomeIcon icon="fa-solid fa-filter" className="text-white me-4" />
                    FILTER
                </Button>
            </ButtonWrapper>
            <Form applyFormValues={applyFormValues} />
        </Offcanvas>
    );
}

export default SearchFilterModal;

const ButtonWrapper = styled.div`
    height: 150px;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.4);
    z-index: 10;

    & > button {
        border-radius: 0;
        font-size: 80px;
    }
`;
