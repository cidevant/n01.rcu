import { StatusBar } from './StatusBar';
import { InputKeyboard } from './InputKeyboard';
import { useGameInfo } from '../../hooks/useGameInfo';

export function Layout(props) {
    const { gameStarted } = useGameInfo();

    return (
        <>
            <StatusBar />
            {props.children}
            {gameStarted && <InputKeyboard />}
        </>
    );
}
