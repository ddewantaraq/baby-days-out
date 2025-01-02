"use client"

import dynamic from 'next/dynamic';

const GameComponent = dynamic(() => import('@/components/Game/GameComponent'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-sky-400 to-sky-200">
      <main className="w-full max-w-5xl mx-auto">
        <GameComponent />
      </main>
    </div>
  );
}
