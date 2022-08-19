import { Sticky, StickyPhantom } from '../Sticky';
import React from 'react';
import styled from 'styled-components';
import Network from './Network';

export function StatusBar() {
    return (
        <>
            <StickyPhantom size={140} />
            <StickyTop top className="d-flex align-items-center">
                <div className="flex-grow-1">
                    <Network />
                </div>
                <div>RIGHT</div>
            </StickyTop>
        </>
    );
}
const StickyTop = styled(Sticky)`
    background-color: #222;
    min-height: 140px;
    height: 140px;
    color: white;
    padding: 0 20px;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.4);
`;
