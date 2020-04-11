import { useState, useEffect } from 'react';
import { getData, getHistory } from '../../api';

export default function useFetchState(state, type) {
  const [inError, setInerror] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        let res;
        switch (type) {
          case 'history':
            res = await getHistory(state);
            break;
          case 'latest':
            res = await getData(state);
            break;
          default:
            res = await getData(state);
            break;
        }
        setData(res);
        setInerror(false);
        setLoading(false);
      } catch (err) {
        setInerror(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [state, type]);
  return [data, inError, loading];
}
