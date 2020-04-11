import React from 'react';
import { ResponsiveContainer, Label, LineChart, YAxis, XAxis, Legend, Line, Tooltip } from 'recharts';
import useFetchState from '../hooks/useFetchState';

export default function Chart({ state }) {
  const [history, historyInErr, historyLoading] = useFetchState(state, 'history');
  if (!historyLoading) {
    return (
      <div style={{ marginTop: '10px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <Label position="center" value="Total Cases" />
            <XAxis dataKey="recent" tickFormatter={el => el.toLocaleString()} />
            <YAxis width={50} />
            <Legend />
            <Tooltip />
            <Line type="monotone" dataKey="totalCases" stroke="#8884d8" name="Total Cases" />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <XAxis dataKey="recent" />
            <YAxis width={50} />
            <Legend />
            <Tooltip />
            <Line type="monotone" dataKey="totalTests" stroke="#82ca9d" name="Total Tests" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return <p>Loading...</p>;
}
