import React from 'react';
import dynamic from 'next/dynamic';

const LumberInventory = dynamic(() => import('../components/LumberInventory'), { ssr: false });

export default function Home() {
  return (
    <div>
      <LumberInventory />
    </div>
  );
}
