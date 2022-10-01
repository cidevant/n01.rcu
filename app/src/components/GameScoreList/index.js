import { useMemo, useEffect, useState } from 'react';
import { isOneDartCheckout } from '../../utils/game';
import { useGameInfo } from '../../hooks/useGameInfo';
import Touchable from 'rc-touchable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, TableRow, TableCell, TableDivider, Button } from './index.style';

export function GameScoreList({ scores, handlers }) {
    function disableContextMenuOnButtonPress(e) {
        e.preventDefault();
    }

    useEffect(() => {
        window.addEventListener('contextmenu', disableContextMenuOnButtonPress);

        return () => {
            window.removeEventListener('contextmenu', disableContextMenuOnButtonPress);
        };
    }, []);

    return (
        <div {...handlers}>
            <Table>
                <tbody>
                    {scores.map((row, index1) => (
                        <RenderTableRowByValueType row={row} key={index1} />
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

function RenderTableRowByValueType({ row }) {
    // Divider
    if (row?.type === 'divider') {
        return <RenderTableDivider />;
    }
    // Normal row
    else if (Array.isArray(row)) {
        return (
            <TableRow>
                {row.map((num, index) => (
                    <RenderTableCell num={num} row={row?.length} key={index} />
                ))}
            </TableRow>
        );
    }
}

function RenderTableCell({ num, rowLength }) {
    const { scoreLeft, dispatchInputScore } = useGameInfo();
    const [value, setValue] = useState(getValueOutput(num));
    const colSpan = useMemo(() => {
        if (num?.colspan > 0) {
            return num?.colspan;
        }
        if (rowLength === 1) {
            return 3;
        }

        return 1;
    }, [num?.colspan, rowLength]);
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

    function getValueOutput(num) {
        if (!isNaN(num)) {
            return num;
        }

        return num?.value;
    }

    function onLongPress(event) {
        event.target.classList.add('confirmed');
        setValue(<FontAwesomeIcon icon="fa-solid fa-check" />);
        dispatchInputScore(event.target.id);
    }

    function onPressOut(event) {
        event.target.classList.remove('confirmed');
        event.target.classList.remove('touching');

        setValue(getValueOutput(num));
    }

    function onPressIn(event) {
        event.target.classList.add('touching');
    }

    return (
        <TableCell colSpan={colSpan}>
            <Touchable
                longPressCancelsPress
                activeStopPropagation
                onLongPress={onLongPress}
                delayLongPress={300}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <Button id={value} buttonStyle={buttonStyle}>
                    {value}
                </Button>
            </Touchable>
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
