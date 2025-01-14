import React from 'react';
import '@/styles/baby-theme.css';
import './welcome.css';

interface WelcomeComponentProps {
  onUsernameSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function WelcomeComponent({ onUsernameSubmit }: WelcomeComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 welcome-bg">
      <div className="welcome-container">
        <h1 className="baby-title">
          Baby Running!
        </h1>
        <form onSubmit={onUsernameSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="username"
              placeholder="What's your name?"
              className="baby-input"
              required
              minLength={2}
              maxLength={20}
            />
          </div>
          <button
            type="submit"
            className="baby-button w-full"
          >
            Let&apos;s Play! 🎈
          </button>
        </form>
      </div>
    </div>
  );
}