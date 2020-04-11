import React from 'react';
import State from './components/State';
import Layout from './Layout';

export default () => (
  <>
    <Layout>
      <State state="AR"></State>
      <State state="LA"></State>
      <State state="TX"></State>
    </Layout>
    <div style={{ marginTop: '50px', textAlign: 'center' }}>
      <a href="https://github.com/trevordebard/covid-tracker">View the Code</a>
    </div>
  </>
);
