import _ from 'lodash';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { config } from '../../config';
import useData from '../../hooks/useData';
import { getAverage } from '../../utils/stats';

export function Opponent({ opponent, average }) {
    return (
        <OpponentName>
            {opponent?.name} ({average?.toFixed?.(2)})
        </OpponentName>
    );
}

const OpponentName = styled.div`
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    margin-top: 30px;
`;
