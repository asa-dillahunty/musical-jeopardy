import { useState } from "react";
import EditGame from "./EditGame";
import GameSelector from "./GameSelector";
import PlayGame from "./PlayGame";
import WebPlayback from "./WebPlayback";
import { konamiSetup } from "../util/konami";
import { AccessToken } from "../util/atoms";
import { useNavigate, useParams } from "react-router-dom";
import { useUserId } from "../util/spotifyAPI";
import { useAtomValue } from "jotai";

function Menu() {
  const navigate = useNavigate();
  const token = useAtomValue(AccessToken);
  const userId = useUserId();

  const [chosenGameID, setChosenGameID] = useState();

  const page = "menu";
  switch (page) {
    case menuOptions.playSelected:
      return (
        <PlayGame
          // setPage={setPage}
          gameID={chosenGameID}
          token={token}
          setChosenGameID={setChosenGameID}
        />
      );
    case menuOptions.playSelection:
      return (
        <GameSelector
          // setPage={setPage}
          userID={userId}
          setChosenGameID={setChosenGameID}
          editing={false}
        />
      );
    case menuOptions.buildSelected:
      return (
        <EditGame
          // setPage={setPage}
          userID={userId}
          gameID={chosenGameID}
          setChosenGameID={setChosenGameID}
          token={token}
        />
      );
    case menuOptions.buildSelection:
      return (
        <GameSelector
          // setPage={setPage}
          userID={userId}
          setChosenGameID={setChosenGameID}
          editing={true}
          token={token}
        />
      );
    default: // menu
      return (
        <div className="menu-container">
          <button onClick={() => navigate("/edit")}>Build/Edit Board</button>
          <button onClick={() => navigate("/play")}>Play Game</button>
          {/* <button onClick={() => setPage(menuOptions.buildSelection)}>
            Build/Edit Board
          </button>
          <button onClick={() => setPage(menuOptions.playSelection)}>
            Play Game
          </button> */}
          {/* <WebPlayback token={token} /> */}
        </div>
      );
  }
}

export const menuOptions = {
  playSelected: "play selected",
  playSelection: "play selection",
  buildSelected: "build selected",
  buildSelection: "build selection",
  mainMenu: "menu",
};

export default Menu;
