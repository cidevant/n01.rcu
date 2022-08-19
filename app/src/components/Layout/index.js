import { StatusBar } from './StatusBar';
import { InputKeyboard } from './InputKeyboard';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';

export function Layout(props) {
    const [isConnected, isPaired] = useNetworkInfo();

    return (
        <>
            <StatusBar isConnected={isConnected} isPaired={isPaired} />
            {props.children}
            {isConnected && isPaired && <InputKeyboard />}
        </>
    );
}
