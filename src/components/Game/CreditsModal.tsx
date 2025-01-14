import React from 'react';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90%] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="baby-title text-2xl mb-4">Credits</h2>
        <div className="space-y-2">
          <p>Thank you very much, much appreciated for those who already provide these assets to support our game:</p>
          <ul className="list-disc pl-5">
            <li>
              <a
                href="https://www.flaticon.com/free-icons/baby"
                title="baby icons"
                className="ml-2 text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Baby icons created by Flat Icons - Flaticon
              </a>
            </li>
            <li>
              <a
                href="https://www.flaticon.com/free-icons/emot"
                title="emot icons"
                className="ml-2 text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Emot icons created by BZZRINCANTATION - Flaticon
              </a>
            </li>
            <li>
              <a
                href="https://www.flaticon.com/free-icons/black-cat"
                title="black cat icons"
                className="ml-2 text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Black cat icons created by amonrat rungreangfangsai - Flaticon
              </a>
            </li>
            <li>
              <a
                href="https://www.flaticon.com/free-icons/dog"
                title="dog icons"
                className="ml-2 text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dog icons created by Flat Icons - Flaticon
              </a>
            </li>
            <li>
              <a
                href="https://www.flaticon.com/free-icons/grinning"
                title="grinning icons"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Grinning icons created by ppangman - Flaticon
              </a>
            </li>
            <li>
              <a
                href="https://www.flaticon.com/free-icons/art-and-design"
                title="art and design icons"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Art and design icons created by Fathema Khanom - Flaticon
              </a>
            </li>
            <li>
              <a
                href="https://www.flaticon.com/free-icons/tile"
                title="tile icons"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tile icons created by Freepik - Flaticon
              </a>
            </li>
            <li>
              <a
                href="https://www.flaticon.com/free-icons/bird"
                title="bird icons"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bird icons created by Freepik - Flaticon
              </a>
            </li>
            <li>
              <a
                href="https://www.flaticon.com/free-icons/cloud"
                title="cloud icons"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cloud icons created by Freepik - Flaticon
              </a>
            </li>
          </ul>
          <p>Other Resources:</p>
          <ul className="list-disc pl-5">
            <li>
              <a
                href="https://cdn.leonardo.ai/users/e03dae91-2b15-47ef-bc2e-2d3259b01402/generations/b578b5e8-8591-43f8-b453-e180a4bf923e/AlbedoBase_XL_create_a_cute_baby_0.jpg"
                title="baby character 1"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Baby Character 1
              </a>
            </li>
            <li>
              <a
                href="https://cdn.leonardo.ai/users/e03dae91-2b15-47ef-bc2e-2d3259b01402/generations/10f1ad94-1517-40af-be6b-e7b30b83a12d/Leonardo_Phoenix_10_Create_a_whimsical_digitally_illustrated_b_3.jpg"
                title="baby character 2"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Baby Character 2
              </a>
            </li>
            <li>
              <a
                href="https://pixabay.com/service/license-summary/"
                title="sound"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sound licensed under Pixabay License
              </a>
            </li>
          </ul>
        </div>
        <button
          onClick={onClose}
          className="baby-button w-full mt-6"
        >
          Close
        </button>
      </div>
    </div>
  );
}