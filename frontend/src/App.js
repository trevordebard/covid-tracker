import React from 'react';
import { getData } from '../api';
import State from './components/State';

export default () => {
  return (
    <>
      <State state="AR"></State>
      <State state="LA"></State>
      <State state="TX"></State>
    </>
  );
};
