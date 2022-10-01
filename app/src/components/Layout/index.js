import { StatusBar } from './StatusBar';
import { InputKeyboard } from './InputKeyboard';
import { useData } from '../../hooks/useData';

export function Layout(props) {
    const { activity } = useData();

    return (
        <>
            <StatusBar />
            {props.children}
            {activity === 'game' && <InputKeyboard />}
        </>
    );
}
