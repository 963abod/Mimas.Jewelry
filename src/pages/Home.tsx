import React from 'react';
import { RingScrollSequence } from '../components/RingScrollSequence';
import { RingOutro } from '../components/RingOutro';

export const Home: React.FC = () => {
  return (
    <>
      <RingScrollSequence />
      <RingOutro />
    </>
  );
};
