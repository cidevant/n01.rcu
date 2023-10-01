import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../store/client.reducer';
import { config } from '../config';

export function useData() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.client.data);

    function dispatchGetData() {
        dispatch(getData());
    }

    const gameData = config.fakeGameState
        ? {
              page: 'game',
              activity: 'game',
              game: {},
          }
        : {
              page: data?.page,
              activity: data?.activity ?? 'idle',
              game: data?.game,
          };

    return {
        data,
        player: data?.player,
        ...gameData,
        dispatchGetData,
    };
}

export default useData;
