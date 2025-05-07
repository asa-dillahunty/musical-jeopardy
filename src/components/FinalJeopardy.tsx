import "./sass/FinalJeopardy.css";
import { useEffect, useState } from "react";
import { PlayCard } from "./GameBoard";
import CurrentlyPlayingWidget from "./CurrentlyPlayingWidget";
import { playTrack } from "../util/spotifyAPI";
import { QRCodeSVG } from "qrcode.react";
import { generatePartyCode } from "../util/lobbyStuff";
import { PlayersContainer } from "./players/PlayersContainer";
import { useAtomValue } from "jotai";
import { AccessToken, NumPlayersAtom, PlayersAtom } from "../util/atoms";
import { Track } from "../util/models";
import { writePlayersData } from "../util/firebaseAPIs";

const JEOPARDY_THEME_URI = "spotify:track:4qkYiZablQoG7f0Qu4Nd1c";

interface FinalJeopardyProps {
  songData: { song: Track; category: string };
  onFinish: () => void;
}

function FinalJeopardy({ songData, onFinish }: FinalJeopardyProps) {
  const token = useAtomValue(AccessToken);
  const players = useAtomValue(PlayersAtom);
  const numPlayers = useAtomValue(NumPlayersAtom);

  const [startedPlaying, setStartedPlaying] = useState(false);
  const [widgetNeedsRefresh, setWidgetNeedsRefresh] = useState(false);
  const [partyId, setPartyId] = useState<string>();

  const refreshWidget = () => {
    setWidgetNeedsRefresh(!widgetNeedsRefresh);
  };

  useEffect(() => {
    if (!startedPlaying) {
      playTrack(JEOPARDY_THEME_URI, token).then(() => {
        refreshWidget();
      });
    } else {
      playTrack(songData.song.uri, token).then(() => {
        refreshWidget();
      });
    }
  }, [startedPlaying]);

  useEffect(() => {
    if (!partyId) {
      const newPartyId = generatePartyCode();
      writePlayersData(newPartyId, players, numPlayers);
      setPartyId(newPartyId);
    }
  }, [partyId]);

  return (
    <div className="login-wrapper">
      <span className="login-text">
        {startedPlaying ? (
          <div className="final-jeopardy-card-wrapper">
            <PlayCard
              val={songData.song}
              refreshWidget={refreshWidget}
              revealCard={() => {}}
              setSelectedCard={() => {
                onFinish();
              }}
            />
          </div>
        ) : (
          <div className="final-jeopardy-card-wrapper">
            <p>It's time for Final Jeopardy!</p>
            <p>Your hint is:</p>
            <p>
              <strong>{songData.category}</strong>
            </p>
            <button onClick={() => setStartedPlaying(true)}>Let's Go!!</button>
          </div>
        )}
        <p>Scan here to join!</p>
        <QRCodeSVG value={window.location.host + "/join/" + partyId} />
        <p>
          Or go to {window.location.host + "/join"} and enter the code:{" "}
          {partyId}
        </p>
        <CurrentlyPlayingWidget
          widgetNeedsRefresh={widgetNeedsRefresh}
          toggleRefresh={refreshWidget}
        />
        <PlayersContainer isPlaying isFinalJeopardy />
      </span>
    </div>
  );
}

export default FinalJeopardy;
