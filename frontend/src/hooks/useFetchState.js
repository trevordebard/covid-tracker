import { useState, useEffect } from 'react';
import { getData } from '../../api';

export default function useFetchState(state) {
  const [inError, setInerror] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getData(state);
        setData(res);
        setInerror(false);
        setLoading(false);
      } catch (err) {
        setInerror(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [state]);
  return { inError, data, loading };
}
