"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const GameComponent = dynamic(() => import("@/components/Game/GameComponent"), {
  ssr: false,
});

export default function Home() {
  const [username, setUsername] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStartGame = () => {
    if (username.trim() !== "") {
      setIsGameStarted(true);
    } else {
      alert("Please enter your username to start the game!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-yellow-200 flex flex-col items-center justify-center p-6 space-y-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-sky-100 opacity-50 animate-clouds"></div>

      <main className="w-full max-w-3xl mx-auto text-center py-8 px-4 z-10">
        <h1 className="text-5xl font-extrabold text-yellow-600 mb-4 flex items-center justify-center animate-bounce">
          <span className="mr-2 text-6xl">🌞</span> Baby Running Game{" "}
          <span className="ml-2 text-6xl">👶</span>
        </h1>
        <p
          className="text-2xl font-bold text-yellow-800 italic mb-6"
          style={{ fontFamily: '"Luckiest Guy", cursive' }}
        >
          "Where every step is an adventure!"
        </p>

        {!isGameStarted && (
          <div className="bg-sky-50 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 animate-text fade-in">
              Enter Your Username
            </h2>
            <input
              type="text"
              className="w-full p-4 rounded-lg border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg text-black"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              className="w-full mt-4 p-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-all"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          </div>
        )}

        {isGameStarted && (
          <div className="w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Game Started!
            </h2>
            <GameComponent />
          </div>
        )}
      </main>

      <div className="absolute bottom-10 left-10 text-3xl text-yellow-400 opacity-70 animate-pulse">
        <span role="img" aria-label="cloud">
          ☁️
        </span>
        <span role="img" aria-label="sun">
          🌞
        </span>
      </div>
    </div>
  );
}
