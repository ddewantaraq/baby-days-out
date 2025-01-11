interface ReadyComponentProps {
  onStartGame: () => void;
}

export default function ReadyComponent({ onStartGame }: ReadyComponentProps) {
  return (
    <div className="relative game-container">
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
        <div className="bg-white p-8 rounded-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-black">How to Play</h2>
          <ul className="text-left space-y-2 mb-6 text-black">
            <li>🏃‍♂️ Run as far as possible</li>
            <li>🚧 Avoid obstacles by jumping</li>
            <li>⌨️ Press SPACE to jump (Desktop)</li>
            <li>📱 Tap screen to jump (Mobile)</li>
          </ul>
          <button
            onClick={onStartGame}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}