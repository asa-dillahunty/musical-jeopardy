import { useEffect, useRef, useState } from "react";
import { useSearchTracks } from "../util/spotifyAPI";
import { AiOutlineSearch } from "react-icons/ai";

import styles from "./sass/SongSelect.module.scss";
import Loading from "./Loading";

type Artist = { name: string };
type Album = { images: { url: string }[]; name: string };
type Track = {
  name: string;
  uri: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
};

export function reduceSongData(song: Track) {
  return {
    name: song.name,
    uri: song.uri,
    album: {
      images: [song.album.images[0]],
      name: song.album.name,
    },
    artists: song.artists.map((artist) => ({ name: artist.name })),
    duration_ms: song.duration_ms,
  };
}

// TODO: fix track types
interface SongSelectProps {
  onClose: () => void;
  selectTrack: (track: any) => void;
  val: any;
}

export function SongSelect({ onClose, selectTrack, val }: SongSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [queryVal, setQueryVal] = useState("");
  const searchTracks = useSearchTracks();
  const { data: trackQueryResult, isPending } = searchTracks(queryVal);
  const searchResults =
    trackQueryResult?.map((track: Track) => reduceSongData(track)) || [];

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      performQuery();
    }
  };

  const performQuery = () => {
    setQueryVal(inputVal);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={styles.questionBox}>
      <div className={styles.searchBar}>
        <input
          ref={inputRef}
          onChange={(e) => setInputVal(e.target.value)}
          value={inputVal}
          onKeyDown={onEnter}
          placeholder="Search for a track..."
        />
        <div className={styles.searchButton} onClick={performQuery}>
          <AiOutlineSearch />
        </div>
      </div>
      <div className={styles.searchBox}>
        {searchResults &&
          searchResults.map((val: Track) => (
            <SongDisplay track={val} key={val.uri} onSelect={selectTrack} />
          ))}
        {isPending && <Loading />}
      </div>
      <button className={styles.closeButton} onClick={() => onClose()}>
        close
      </button>
      {val && <SongDisplay track={val} key={val.uri} />}
    </div>
  );
}

interface SongDisplayProps {
  track: Track;
  onSelect?: (track: Track) => void;
}

function SongDisplay({ track, onSelect }: SongDisplayProps) {
  const minutes = Math.floor(track.duration_ms / 60000);
  const seconds = Math.floor((track.duration_ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  return (
    <div
      className={
        styles.searchItem + (onSelect ? "" : " " + styles.selectedSearchItem)
      }
      onClick={() => {
        if (onSelect) onSelect(reduceSongData(track));
      }}
    >
      <img src={track.album.images[0]?.url} alt={`${track.album.name} cover`} />
      <div className={styles.info}>
        <p className={styles.title}>{track.name}</p>
        <p className={styles.artist}>
          {track.artists.map((a) => a.name).join(", ")}
        </p>
        <p className={styles.album}>{track.album.name}</p>
      </div>
      {Boolean(minutes && seconds) && (
        // these values can be 'NaN' when editing boards and viewing old selected songs
        <div className={styles.duration}>
          {minutes}:{seconds}
        </div>
      )}
    </div>
  );
}
