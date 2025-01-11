import React from 'react';

interface WelcomeComponentProps {
  onUsernameSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function WelcomeComponent({ onUsernameSubmit }: WelcomeComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-3xl font-bold mb-8 text-black">
        Baby Running!
      </h1>
      <form onSubmit={onUsernameSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          className="px-4 py-2 border rounded w-full"
          required
          minLength={2}
          maxLength={20}
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Start Game
        </button>
      </form>
    </div>
  );
}