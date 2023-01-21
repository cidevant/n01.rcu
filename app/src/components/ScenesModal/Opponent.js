import styled from 'styled-components';

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
