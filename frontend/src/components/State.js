import React from 'react';
import useFetchState from '../hooks/useFetchState';

export default function State({ state }) {
  const res = useFetchState(state);
  const { data, inError, loading } = res;
  if (inError) {
    return <p>error...</p>;
  }
  if (loading) {
    return <p>loading..</p>;
  }
  const created = new Date(data.created);
  const lastChecked = new Date(data.lastChecked);
  return (
    <div>
      <h1>{getStateName(state)}</h1>
      <p>Total Cases: {data.totalCases.toLocaleString()}</p>
      <p>Total Tests: {data.totalTests.toLocaleString()}</p>
      {data.hospitalizations && <p>Hospitalizations: {data.hospitalizations.toLocaleString()}</p>}
      <p>Updated: {created.toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST</p>
      <p>Last Checked: {lastChecked.toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST</p>
    </div>
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
