import { useState } from "react";
import ClickBlocker from "../ClickBlocker";
import { SongSelect } from "../SongSelect";
import { useAtomValue } from "jotai";
import { AccessToken } from "../../util/atoms";

interface PlayerIconProps {
  color: string;
  url?: string;
  // TODO: this is a track, not any
  updateAlbumCover?: (val: any) => void;
}

export default function PlayerIcon({
  color,
  url,
  updateAlbumCover,
}: PlayerIconProps) {
  const [open, setOpen] = useState(false);
  const [song, setSong] = useState(null);
  const token = useAtomValue(AccessToken);

  const updateSong = (track) => {
    setSong(track);

    // this should always be defined since we restrict the click blocker from opening if it doesn't
    if (updateAlbumCover) updateAlbumCover(track);
  };

  if (!url && song) url = song.album.images[0].url;
  const extraStyles = url
    ? {
        backgroundImage: `url(${url})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }
    : { backgroundColor: color };

  return (
    <div>
      <ClickBlocker custom block={open}>
        <SongSelect
          token={token}
          onClose={() => {
            setOpen(false);
          }}
          selectTrack={(track) => updateSong(track)}
          val={song}
        />
      </ClickBlocker>

      <div
        onClick={() => {
          if (updateAlbumCover) setOpen(true);
        }}
        className="player-icon"
        style={extraStyles}
      ></div>
    </div>
  );
}
