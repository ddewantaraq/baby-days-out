"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AssetLoader from "../AssetLoader";
import S3Image from "../S3Image";
import Ground from "../Ground";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { GameState, ObstacleType, Obstacle } from "@/types/game";
import { gsap } from "gsap";
import { setupGSAP } from "./gsapConfig";
import { audioManager } from "../music/AudioManager";
import CountdownOverlay from "./CountdownOverlay";
import WelcomeComponent from "./WelcomeComponent";
import ReadyComponent from "./ReadyComponent";

import "./game.css";
import Sky from "../Sky";

const INITIAL_SPEED = 8;
const SPEED_INCREMENT = 1.0; // Maximum speed increment for milestone achievements
const BASE_OBSTACLE_SPAWN_INTERVAL = 1200; // Further reduced base spawn interval
const MIN_OBSTACLE_SPAWN_INTERVAL = 700; // Lower minimum spawn interval
const SPEED_MILESTONE = 500; // Speed increase milestone
const SCORE_MILESTONE = 100;
const DOUBLE_JUMP_MILESTONE = 500;

export default function GameComponent() {
  const [username, setUsername] = useLocalStorage("username", "");
  const [highScore, setHighScore] = useLocalStorage("highScore", 0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const [isJumping, setIsJumping] = useState(false);
  const [canDoubleJump, setCanDoubleJump] = useState(true);

  const gameLoopRef = useRef<number>(0);
  const lastObstacleSpawnRef = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const characterRef = useRef<HTMLDivElement>(null);
  const gameLoopFuncRef = useRef<() => void>(() => {});

  // Reset game state on mount
  useEffect(() => {
    if (username) {
      setGameState("ready");
    } else {
      setGameState("idle");
    }
    const character = characterRef.current;
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (character) {
        character.classList.remove("jumping", "double-jumping");
      }
    };
  }, [username]);

  const handleUsernameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newUsername = formData.get("username") as string;
    if (newUsername) {
      setUsername(newUsername);
      setGameState("ready");
    }
  };

  const checkCollisions = useCallback(() => {
    if (!characterRef.current) return false;

    // Get character's actual DOM position
    const characterRect = characterRef.current.getBoundingClientRect();
    const characterLeft = characterRect.left + window.scrollX;
    const characterTop = characterRect.top + window.scrollY;

    // Collision boxes matching new visual size
    const CHARACTER_WIDTH = 80; // Visual width is 80px
    const CHARACTER_HEIGHT = 80; // Visual height is 80px

    // Define character collision box with adjusted buffer for new dimensions
    const characterBox = {
      left: characterLeft + 15, // Add buffer from sides
      right: characterLeft + CHARACTER_WIDTH - 15,
      top: characterTop + 15, // Add buffer from top/bottom
      bottom: characterTop + CHARACTER_HEIGHT - 15,
    };

    // Check each obstacle
    for (const obstacle of obstaclesRef.current) {
      const obstacleElement = document.getElementById(
        `obstacle-${obstacle.id}`
      );
      if (!obstacleElement) continue;

      const obstacleRect = obstacleElement.getBoundingClientRect();

      // Define obstacle collision box with adjusted buffer for new dimensions
      const obstacleBox = {
        left: obstacleRect.left + 10, // Add buffer from sides
        right: obstacleRect.right - 10,
        top: obstacleRect.top + 10, // Add buffer from top/bottom
        bottom: obstacleRect.bottom - 10,
      };

      // Simple AABB collision with larger tolerance
      const hasCollision = !(
        (
          characterBox.right < obstacleBox.left + 10 || // Add 10px tolerance
          characterBox.left > obstacleBox.right - 10 || // Add 10px tolerance
          characterBox.bottom < obstacleBox.top + 10 || // Add 10px tolerance
          characterBox.top > obstacleBox.bottom - 10
        ) // Add 10px tolerance
      );

      if (hasCollision) {
        return true;
      }
    }
    return false;
  }, []);

  const jump = useCallback(() => {
    if (!isJumping) {
      setIsJumping(true);
      audioManager.playJumpSound();
      if (characterRef.current) {
        characterRef.current.classList.add("jumping");
        setTimeout(() => {
          if (characterRef.current) {
            characterRef.current.classList.remove("jumping");
          }
        }, 600);
      }
      setCanDoubleJump(score >= DOUBLE_JUMP_MILESTONE);
      setTimeout(() => {
        if (characterRef.current) {
          setIsJumping(false);
          setCanDoubleJump(false);
        }
      }, 600);
    } else if (canDoubleJump && score >= DOUBLE_JUMP_MILESTONE) {
      const characterElement = characterRef.current;
      audioManager.playJumpSound();
      if (characterElement) {
        characterElement.style.animation = "none";
        //characterElement.offsetHeight; // Trigger reflow
        characterElement.style.animation = "";
        characterElement.classList.remove("jumping");
        characterElement.classList.add("double-jumping");
        setTimeout(() => {
          characterElement.classList.remove("double-jumping");
        }, 600);
      }
      setCanDoubleJump(false);
    }
  }, [isJumping, canDoubleJump, score]);

  const gameOver = useCallback(() => {
    const finalScore = scoreRef.current; // Get the latest score from ref
    if (finalScore > highScore || highScore === 0) {
      setHighScore(finalScore);
    }
    setScore(finalScore); // Update the score state with the final score
    setGameState("gameover");
    audioManager.stopBackgroundMusic();
    audioManager.playGameOverSound();
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highScore]);

  // Game loop definition
  const gameLoop = useCallback(() => {
    const now = Date.now();
    if (!lastFrameTime.current) {
      lastFrameTime.current = now;
    }

    // Maintain 60fps
    const elapsed = now - lastFrameTime.current;
    if (elapsed < 16) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    lastFrameTime.current = now;

    // Check collisions first
    if (checkCollisions()) {
      gameOver();
      return;
    }

    // Update obstacle positions and handle animations
    setObstacles((prevObstacles) => {
      if (!characterRef.current) return prevObstacles;

      const currentSpeed = speedRef.current;
      const characterRect = characterRef.current.getBoundingClientRect();
      const characterRight = characterRect.right;

      const updatedObstacles = prevObstacles
        .map((obstacle) => {
          const newX = obstacle.x - currentSpeed;

          // Check if obstacle needs to be animated
          if (!animatedObstacles.current.has(obstacle.id)) {
            const distanceToCharacter = obstacle.x - characterRight;
            const secondsUntilReach = distanceToCharacter / (currentSpeed * 60);

            if (secondsUntilReach <= 0.5 && secondsUntilReach >= 0.2) {
              const obstacleElement = document.getElementById(
                `obstacle-${obstacle.id}`
              );
              if (obstacleElement) {
                const imageElement = obstacleElement.querySelector("img");
                if (imageElement) {
                  // Kill any existing animations
                  gsap.killTweensOf(imageElement);

                  // Show immediately
                  gsap.set(obstacleElement, {
                    visibility: "visible",
                    immediateRender: true,
                  });

                  // Animate with GSAP
                  gsap.fromTo(
                    imageElement,
                    {
                      opacity: 0,
                      scale: 0.5,
                      y: 15,
                      filter: "blur(4px)",
                      immediateRender: true,
                    },
                    {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      filter: "none",
                      duration: 0.25,
                      ease: "back.out(2)",
                      clearProps: "transform,filter",
                      onStart: () => {
                        if (animatedObstacles.current) {
                          animatedObstacles.current.add(obstacle.id);
                        }
                      },
                    }
                  );
                }
              }
            }
          }

          return {
            ...obstacle,
            x: newX,
          };
        })
        .filter((obstacle) => obstacle.x > -100);

      // Keep ref in sync with state
      obstaclesRef.current = updatedObstacles;
      return updatedObstacles;
    });

    // Calculate current spawn interval with more varied distances after 500 points
    const milestonesPassed = Math.floor(scoreRef.current / SPEED_MILESTONE);
    const baseInterval = BASE_OBSTACLE_SPAWN_INTERVAL - milestonesPassed * 300;

    // Add random variation to spawn intervals after 500 points
    const randomVariation =
      scoreRef.current >= 1000 ? Math.random() * 400 - 200 : 0;

    const currentSpawnInterval = Math.max(
      MIN_OBSTACLE_SPAWN_INTERVAL,
      baseInterval + randomVariation - Math.floor(scoreRef.current / 50) * 30
    );

    // Spawn new obstacles
    if (now - (lastObstacleSpawnRef.current || now) >= currentSpawnInterval) {
      const shouldSpawnAngry = Math.random() < 0.2 + milestonesPassed * 0.05; // Increase angry obstacle probability
      const obstacleType = shouldSpawnAngry
        ? Math.random() < 0.5
          ? ObstacleType.ANGRY_CAT
          : ObstacleType.ANGRY_DOG
        : Math.random() < 0.5
        ? ObstacleType.NORMAL_CAT
        : ObstacleType.NORMAL_DOG;

      setObstacles((prev) => {
        const lastObstacle = prev[prev.length - 1];
        if (lastObstacle && lastObstacle.x > window.innerWidth - 100) {
          return prev;
        }

        const newId = Date.now();
        const newObstacles = [
          ...prev,
          {
            id: newId,
            type: obstacleType,
            x: window.innerWidth + 300, // Give more time to react
            y: 10, // Adjust to align with ground
            animated: true, // Track animation state
          },
        ];

        // Set initial state for new obstacles
        const obstacleElement = document.getElementById(`obstacle-${newId}`);
        if (obstacleElement) {
          const imageElement = obstacleElement.querySelector("img");
          if (imageElement) {
            gsap.set(imageElement, {
              opacity: 0,
              scale: 0.5,
              y: 20,
              filter: "blur(4px)",
              force3D: true,
              transformOrigin: "center center",
            });
          }
          gsap.set(obstacleElement, {
            visibility: "hidden",
          });
        }

        // Keep ref in sync with state
        obstaclesRef.current = newObstacles;
        return newObstacles;
      });

      lastObstacleSpawnRef.current = now;
    }

    // Update score
    const newScore = scoreRef.current + 1;
    scoreRef.current = newScore;
    setScore(newScore);

    // Increase difficulty
    if (newScore > 0 && newScore % SCORE_MILESTONE === 0) {
      const speedIncrease =
        newScore % SPEED_MILESTONE === 0
          ? SPEED_INCREMENT
          : SPEED_INCREMENT * 0.5;
      const newSpeed = speedRef.current + speedIncrease;
      speedRef.current = newSpeed;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [checkCollisions, gameOver]);

  const startGame = useCallback(async () => {
    // Ensure all audio and assets are loaded before starting
    if (!audioManager.isInitialized()) {
      audioManager.preloadAudio();
    }

    const assetLoader = AssetLoader.getInstance();
    await assetLoader.preloadGameAssets();
    
    if (!assetLoader.areAllAssetsLoaded()) {
      console.log("Assets still loading...");
      return;
    }

    console.log("Starting game...");
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    // Reset all game state
    setGameState("countdown");
    setScore(0);
    scoreRef.current = 0;
    speedRef.current = INITIAL_SPEED;
    setIsJumping(false);
    setCanDoubleJump(false);

    // Initialize with one obstacle to start
    const initialObstacle = {
      id: Date.now(),
      type:
        Math.random() < 0.5 ? ObstacleType.NORMAL_CAT : ObstacleType.NORMAL_DOG,
      x: window.innerWidth + 300, // Give more initial distance
      y: 10, // Adjust to align with ground,
      animated: true,
    };

    // Reset game state and refs
    lastObstacleSpawnRef.current = Date.now();
    lastFrameTime.current = Date.now();

    // Clear existing obstacles and set initial one
    obstaclesRef.current = [initialObstacle];
    setObstacles([initialObstacle]);

    // Don't start the game loop yet - wait for countdown to complete
    // Game loop will be started by the CountdownOverlay's onComplete callback
  }, []);

  // Sync obstacles ref with state
  useEffect(() => {
    obstaclesRef.current = obstacles;
  }, [obstacles]);

  // Initialize game loop reference - moved higher up to fix dependency issue
  useEffect(() => {
    setupGSAP();
    gameLoopFuncRef.current = gameLoop;
  }, [gameLoop, startGame, checkCollisions, gameOver]);

  // Animation state tracking without using React state
  const animatedObstacles = useRef(new Set<number>());

  // Reset animation state when game restarts
  useEffect(() => {
    if (gameState === "playing") {
      animatedObstacles.current.clear();
    }
  }, [gameState]);

  // Clean up any debug visualization boxes when unmounting
  useEffect(() => {
    return () => {
      const debugBoxes = document.querySelectorAll("[data-debug-box]");
      debugBoxes.forEach((box) => box.remove());
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (gameState === "ready" || gameState === "gameover") {
          startGame();
        } else if (gameState === "playing") {
          jump();
        }
      }
    };

    const handleTouchStart = () => {
      if (gameState === "ready") {
        startGame();
      } else if (gameState === "playing") {
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [gameState, jump, startGame]);

  //handle browser autoplay restriction
  useEffect(() => {
    const handleUserInteraction = () => {
      audioManager.preloadAudio();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  if (!username) {
    return <WelcomeComponent onUsernameSubmit={handleUsernameSubmit} />;
  }

  if (gameState === "ready") {
    return <ReadyComponent onStartGame={startGame} />;
  }

  return (
    <div className="relative game-container">
      <div className="absolute top-4 left-4 z-20 text-lg font-bold text-white text-shadow">
        Player: {username}
      </div>
      <div className="absolute top-4 right-4 z-20 text-lg font-bold text-white text-shadow">
        High Score: {highScore} | Score: {score}
      </div>
      <Sky />

      <Ground />

      {gameState === "countdown" && (
        <CountdownOverlay
          onComplete={() => {
            setGameState("playing");
            audioManager.playBackgroundMusic();
            // Start game loop here after countdown completes
            if (gameLoopFuncRef.current) {
              gameLoopRef.current = requestAnimationFrame(
                gameLoopFuncRef.current
              );
            }
          }}
        />
      )}

      <div
        ref={characterRef}
        className={`character ${isJumping ? "jumping" : ""}`}
      >
        <S3Image
          imageKey="baby-boy.png"
          alt="Baby Character"
          width={80}
          height={80}
          style={{ marginBottom: "20px" }}
        />
      </div>

      {obstacles.map((obstacle) => (
        <div
          key={obstacle.id}
          id={`obstacle-${obstacle.id}`}
          className="obstacle"
          style={{ transform: `translateX(${obstacle.x}px)` }}
        >
          <S3Image
            imageKey={`${obstacle.type}.png`}
            alt={obstacle.type}
            width={65}
            height={65}
          />
        </div>
      ))}

      {gameState === "gameover" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50" style={{zIndex: 99}}>
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl mb-4 text-black">Game Over!</h2>
            <p className="mb-4 text-black">Score: {score}</p>
            <button
              onClick={startGame}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
