import React from 'react';
import State from './components/State';
import Layout from './Layout';

export default () => (
  <>
    <Layout>
      <State state="AR"></State>
      <State state="LA"></State>
      <State state="TX"></State>
      <a
        href="https://github.com/trevordebard/covid-tracker"
        style={{ marginBottom: '10px', bottom: 0, textAlign: 'center', width: '100%' }}
      >
        View the Code
      </a>
    </Layout>
  </>
);
