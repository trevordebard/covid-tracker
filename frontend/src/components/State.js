import React, { useEffect, useState } from 'react';
import { getData } from '../../api';

export default function State({ state }) {
  // TODO: Create custom hook for thi
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
        console.log(err);
      }
    }
    fetchData();
  }, [data, state]);
  if (inError) {
    return <p>error...</p>;
  }
  if (loading) {
    return <p>loading..</p>;
  }
  return (
    <div>
      <h1>{getStateName(state)}</h1>
      <p>Total Cases: {data.totalCases}</p>
      <p>Total Tests: {data.totalTests}</p>
    </div>
  );
}

function getStateName(state) {
  if (state === 'AR') {
    return 'Arkansas';
  }
  return 'State Unknown';
}
