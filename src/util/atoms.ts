import { atom, useSetAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import { PlayerType } from "./models";

export const AccessToken = atomWithStorage("spotify_access_token", "");
export const AccessTokenExpiration = atomWithStorage(
  "spotify_access_token_expiration",
  0
);
export const UserId = atom<string>();

export const NumPlayersAtom = atomWithStorage("Num_Players", 2);

// export const SelectedPlayerIndex = atom<number | null>();

const getPlayersAtomDefault = () => [
  { index: 0, name: "Player 1", color: "red", score: 0 },
  { index: 1, name: "Player 2", color: "blue", score: 0 },
  { index: 2, name: "Player 3", color: "yellow", score: 0 },
  { index: 3, name: "Player 4", color: "green", score: 0 },
  { index: 4, name: "Player 5", color: "black", score: 0 },
  { index: 5, name: "Player 6", color: "white", score: 0 },
  { index: 6, name: "Player 7", color: "pink", score: 0 },
  { index: 7, name: "Player 8", color: "purple", score: 0 },
];

export const PlayersAtom = atomWithStorage<PlayerType[]>(
  "Players_Data",
  getPlayersAtomDefault()
);

export const useResetPlayers = () => {
  const setPlayers = useSetAtom(PlayersAtom);
  return () => setPlayers(RESET);
};

export const useUpdatePlayerName = () => {
  const setPlayers = useSetAtom(PlayersAtom);

  return (playerIndex: number, name: string) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[playerIndex] = { ...next[playerIndex], name };
      return next;
    });
  };
};

export const useUpdatePlayerScore = () => {
  const setPlayers = useSetAtom(PlayersAtom);

  return (playerIndex: number, score: number | string) => {
    if (typeof score === "string") {
      score = parseInt(score);
    }

    setPlayers((prev) => {
      const next = [...prev];
      next[playerIndex] = { ...next[playerIndex], score };
      return next;
    });
  };
};

export const useUpdatePlayerUrl = () => {
  const setPlayers = useSetAtom(PlayersAtom);

  return (playerIndex: number, url: string) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[playerIndex] = { ...next[playerIndex], url };
      return next;
    });
  };
};
