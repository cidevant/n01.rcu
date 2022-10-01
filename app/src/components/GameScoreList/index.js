import { useMemo } from 'react';
import styled from 'styled-components';
import { isOneDartCheckout } from '../../utils/game';
import { useGameInfo } from '../../hooks/useGameInfo';

export function GameScoreList({ scores, longPressHandlers }) {
    return (
        <Table>
            <tbody>
                {scores.map((row, index1) => (
                    <RenderTableRowByValueType
                        row={row}
                        longPressHandlers={longPressHandlers}
                        key={index1}
                    />
                ))}
            </tbody>
        </Table>
    );
}

function RenderTableRowByValueType({ row, longPressHandlers }) {
    // Divider
    if (row?.type === 'divider') {
        return <RenderTableDivider />;
    }
    // Normal row
    else if (Array.isArray(row)) {
        return (
            <TableRow>
                {row.map((num, index) => (
                    <RenderTableCell
                        num={num}
                        row={row}
                        key={index}
                        longPressHandlers={longPressHandlers}
                    />
                ))}
            </TableRow>
        );
    }
}

function RenderTableCell({ num, row, longPressHandlers }) {
    const { scoreLeft } = useGameInfo();

    function getColspan() {
        if (num?.colspan > 0) {
            return num?.colspan;
        }
        if (row?.length === 1) {
            return 3;
        }

        return 1;
    }

    const value = useMemo(() => {
        if (!isNaN(num)) {
            return num;
        }

        return num?.value;
    }, [num]);

    const buttonStyle = useMemo(() => {
        if (value === scoreLeft && isOneDartCheckout(value)) {
            return 'finish';
        }

        const style = num?.style;

        if (style === 'outs' && scoreLeft > 100) {
            return null;
        }

        return style;
    }, [num, value, scoreLeft]);

    return (
        <TableCell colSpan={getColspan()}>
            <Button id={value} buttonStyle={buttonStyle} {...longPressHandlers}>
                {value}
            </Button>
        </TableCell>
    );
}

function RenderTableDivider() {
    return (
        <TableRow>
            <TableDivider colSpan={3}>
                <hr />
            </TableDivider>
        </TableRow>
    );
}

const Table = styled.table`
    width: 100%;
    padding: 10px;
`;

const TableRow = styled.tr`
    width: 100%;
`;

const TableCell = styled.td`
    width: 33%;
    border: 14px solid transparent;
`;

const TableDivider = styled(TableCell)`
    width: 100%;
`;

const Button = styled.button`
    color: black;
    background-color: #eee;
    border: 2px solid #aaa;
    box-shadow: 2px 2px 6px 1px #666;
    width: 100%;
    font-size: 140px;
    padding: 20px 0;
    display: block;
    text-align: center;
    opacity: 1;
    user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    font-weight: bolder;

    ${({ buttonStyle }) => {
        switch (buttonStyle) {
            case 'zero':
                return 'background-color: red; border-color: #b30000; color: white;';
            case 'good':
                return 'background-color: #ddffcc; border-color: #4ce600;';
            case 'outs':
                return 'background-color: #faf5a7; border-color: #c06d00;';
            case 'finish':
                return 'background-color: #22ff34; border-color: #2d8600;';
        }
    }}

    &.ok {
        background-color: #ccff33;
        border-color: #99cc00;
        color: black;
    }
`;
