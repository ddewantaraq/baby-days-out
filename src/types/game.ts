export type GameState = 'idle' | 'ready' | 'playing' | 'gameover';

export enum ObstacleType {
    NORMAL_CAT = 'cat',
    NORMAL_DOG = 'dog',
    ANGRY_CAT = 'angry-cat',
    ANGRY_DOG = 'angry-dog'
}

export interface Obstacle {
    id: number;
    type: ObstacleType;
    x: number;
    y: number;
}