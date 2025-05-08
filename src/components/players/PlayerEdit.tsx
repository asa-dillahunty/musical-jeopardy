import { useEffect, useRef, useState, KeyboardEvent } from "react";
import PlayerIcon from "./PlayerIcon";
import {
  PlayersAtom,
  useUpdatePlayerName,
  useUpdatePlayerUrl,
} from "../../util/atoms";
import { useAtomValue } from "jotai";

interface PlayerEditProps {
  selectedPlayerIndex: number;
  setEditing: (val: boolean) => void;
}

export default function PlayerEdit({
  selectedPlayerIndex,
  setEditing,
}: PlayerEditProps) {
  const players = useAtomValue(PlayersAtom);
  const selectedPlayer = players[selectedPlayerIndex];

  const [playerName, setPlayerName] = useState(selectedPlayer?.name);

  const updatePlayerName = useUpdatePlayerName();
  const updatePlayerUrl = useUpdatePlayerUrl();

  const inputRef = useRef<HTMLInputElement>(null);

  const attemptSave = (name: string) => {
    if (name.trim() === "") return;
    updatePlayerName(selectedPlayer.index, name.trim().slice(0, 10).trim());
    setEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      attemptSave(playerName);
    }
  };

  const updateAlbumCover = (song) => {
    if (!song) return;
    updatePlayerUrl(selectedPlayer.index, song.album.images[0].url);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  return (
    <div className="player-edit">
      <PlayerIcon
        color={selectedPlayer.color}
        url={selectedPlayer.url}
        updateAlbumCover={updateAlbumCover}
      />
      <input
        className="player-name-input"
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Player Name"
        value={playerName}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      <div>
        <button onClick={() => attemptSave(playerName)}>save</button>
        <button onClick={() => setEditing(false)}>close</button>
      </div>
    </div>
  );
}
