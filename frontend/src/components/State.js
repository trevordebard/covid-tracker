import React, { useEffect, useState } from 'react';
import { getData } from '../../api';
export default function State({ state }) {
  const [inError, setInerror] = useState(false);
  const [totalCases, setTotalCases] = useState();
  const [totalTests, setTotalTests] = useState();
  const [data, setData] = useState();
  useEffect(async () => {
    try {
      let data = await getData(state);
      setTotalCases(data.totalCases);
      setTotalTests(data.totalTests);
    } catch (err) {
      setInerror(true);
    }
  }, []);
  if (inError) {
    return <p>error...</p>;
  }
  return (
    <div>
      <h1>{getStateName(state)}</h1>
      <p>Total Cases: {totalCases}</p>
      <p>Total Tests: {totalTests}</p>
    </div>
  );
}

function getStateName(state) {
  if (state === 'AR') {
    return 'Arkansas';
  } else {
    return 'State Unknown';
  }
}
