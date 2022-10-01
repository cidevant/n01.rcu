import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../store/client.reducer';

export function useData() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.client.data);

    function dispatchGetData() {
        dispatch(getData());
    }

    return {
        data,
        activity: data?.activity ?? 'idle',
        game: data?.game,
        dispatchGetData,
    };
}

export default useData;
