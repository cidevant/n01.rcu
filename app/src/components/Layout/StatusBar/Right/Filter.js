import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SearchFilterModal } from '../../../SearchFilterModal';
import { Button } from './index';

export function Filter() {
    const [modalShow, setModalShow] = useState(false);

    function onShow() {
        setModalShow(true);
    }
    function onClose() {
        setModalShow(false);
    }

    return (
        <>
            <FilterButton open={onShow} />
            <SearchFilterModal show={modalShow} close={onClose} />
        </>
    );
}

export default Filter;

function FilterButton({ open }) {
    const color = '#6c757d';

    return (
        <div className="d-flex align-items-center">
            <div className="ms-4">
                <Button color={color} onClick={open}>
                    <FontAwesomeIcon icon="fa-solid fa-filter" />
                </Button>
            </div>
        </div>
    );
}