import React from 'react';
import styled from 'styled-components';
import useFetchState from '../hooks/useFetchState';
import Chart from './Chart';

const StateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 460px;
  min-width: 360px;
`;
const Stats = styled.div`
  p {
    margin: 5px;
    span {
      font-weight: 500;
    }
  }
  h1 {
    text-align: center;
  }
`;
const TimeStat = styled.p`
  font-size: 0.8em;
  font-style: italic;
`;
export default function State({ state }) {
  const [data, inError, loading] = useFetchState(state, 'latest');
  if (inError) {
    return <p>error...</p>;
  }
  if (loading) {
    return <p>loading..</p>;
  }
  const created = new Date(data.created);
  const lastChecked = new Date(data.lastChecked);
  return (
    <StateContainer>
      <Stats>
        <h1>{getStateName(state)}</h1>
        <p>
          Cases: <span>{data.totalCases.toLocaleString()}</span>
        </p>
        <p>
          Tests: <span>{data.totalTests.toLocaleString()}</span>
        </p>
        {data.deaths && (
          <p>
            Deaths: <span>{data.deaths}</span>
          </p>
        )}
        {data.hospitalizations && (
          <p>
            Hospitalizations: <span>{data.hospitalizations.toLocaleString()}</span>
          </p>
        )}
        <TimeStat>Updated: {created.toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST</TimeStat>
        <TimeStat>Last Checked: {lastChecked.toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST</TimeStat>
      </Stats>
      <div>
        <Chart state={state} />
      </div>
    </StateContainer>
  );
}

function getStateName(state) {
  if (state === 'AR') {
    return 'Arkansas';
  }
  if (state === 'LA') {
    return 'Louisiana';
  }
  if (state === 'TX') {
    return 'Texas';
  }
  return 'State Unknown';
}
