import { Sticky, StickyPhantom } from '../Sticky';
import React from 'react';
import styled from 'styled-components';
import { LeftButtons } from './Left';
import { RightButtons } from './Right';
import { useData } from '../../hooks/useData';

export function TopBar() {
    const { activity } = useData();

    if (activity === 'game') {
        return null;
    }

    return (
        <>
            <StickyPhantom size={150} />
            <StickyTop top className="d-flex align-items-center">
                <div className="flex-grow-1">
                    <LeftButtons />
                </div>
                <div>
                    <RightButtons />
                </div>
            </StickyTop>
        </>
    );
}

export default TopBar;

const StickyTop = styled(Sticky)`
    background-color: #222;
    min-height: 150px;
    height: 150px;
    color: white;
    padding: 0 0px;
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.4);
`;
