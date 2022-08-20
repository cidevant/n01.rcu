import { StatusBar } from './StatusBar';
import { InputKeyboard } from './InputKeyboard';

export function Layout(props) {
    return (
        <>
            <StatusBar />
            {props.children}
            <InputKeyboard />
        </>
    );
}
