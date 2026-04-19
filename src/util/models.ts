import { CanvasPath } from "react-sketch-canvas";

export type PlayerType = {
  index: number;
  name: string;
  color: string;
  url?: string;
  score: number;

  // the following are final jeopardy only
  ready?: boolean;
  wager?: number;
  sketch?: CanvasPath[];
};

export type Artist = { name: string };
export type Album = { images: { url: string }[]; name: string };
export type Track = {
  name: string;
  uri: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
};

export interface JeopardyGame {
  id: string;
  name: string;
  numBoards: number;
  userId: string;

  boards: [JeopardyBoard, JeopardyBoard, JeopardyBoard];
  finalJeopardy?: {
    category: string;
    song: Track;
  };
}

export interface JeopardyBoard {
  cols: number;
  rows: number;

  dailyDoublePositions: DailyDoublePosition[];

  multiplier: number;
  dailyDoubles: number;

  grid: BoardGrid;
}

export type BoardGridIndex = 0 | 1 | 2 | 3 | 4 | 5;

export interface BoardGrid {
  0: string[];
  1: string[];
  2: string[];
  3: string[];
  4: string[];
  5: string[];
}

export interface DailyDoublePosition {
  i: number;
  j: number;
}
