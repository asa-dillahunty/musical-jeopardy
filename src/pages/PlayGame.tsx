import "./sass/PlayGame.css";
import { useState } from "react";
import GameBoard from "../components/GameBoard";
import { useGame } from "../util/firebaseAPIs";
import FinalJeopardy from "../components/FinalJeopardy";
import { ScoreBoard } from "../components/ScoreBoard";
import { useNavigate, useParams } from "react-router-dom";
import usePersistedState from "../util/usePersistedState";
import PlayerSetup from "../components/players/PlayerSetup";

function PlayGame({}) {
  const navigate = useNavigate();
  const { gameId } = useParams();

  // const [selectedBoard, setSelectedBoard] = usePersistedState(gameId + "-" + "selectedBoard", null);
  const [selectedBoardIndex, setSelectedBoardIndex] = usePersistedState(
    gameId + "-" + "selectedBoardIndex",
    -1
  );
  const [playFinalJeopardy, setPlayFinalJeopardy] = useState(false);
  const { data: gameData, isLoading, isError } = useGame(gameId);
  const [playersInitialized, setPlayersInitialized] =
    usePersistedState<boolean>(gameId + "-" + "playersInitialized", false);
  const [showScoreBoard, setShowScoreBoard] = useState(false);

  const playNextState = () => {
    if (selectedBoardIndex === gameData.numBoards - 1) {
      setSelectedBoardIndex(-1);
      setPlayFinalJeopardy(true);
    } else {
      setSelectedBoardIndex(selectedBoardIndex + 1);
    }
  };

  const onFinishFinalJeopardy = () => {
    setPlayFinalJeopardy(false);
    setShowScoreBoard(true);
  };

  if (isLoading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>Some error. Contact site owner.</p>;
  } else if (!gameData) {
    return <p>Some error. Contact site owner.</p>;
  }

  if (playersInitialized === false) {
    return <PlayerSetup setPlayersInitialized={setPlayersInitialized} />;
  } else if (showScoreBoard) {
    return <ScoreBoard />;
  } else if (playFinalJeopardy) {
    return (
      <FinalJeopardy
        songData={gameData.finalJeopardy}
        onFinish={onFinishFinalJeopardy}
      />
    );
  } else if (selectedBoardIndex !== -1) {
    return (
      <GameBoard
        boardIndex={selectedBoardIndex}
        board={gameData.boards[selectedBoardIndex]}
        preview={false}
        editing={false}
        playNextBoard={playNextState}
        returnToGame={() => setSelectedBoardIndex(-1)}
      />
    );
  }
  return (
    <div className="edit-game">
      <button onClick={() => navigate("/play")}>Back</button>
      <button onClick={() => setPlayersInitialized(false)}>Player Setup</button>
      <div>
        <p>{gameData.name}</p>
      </div>

      <div className="game-board-list">
        {gameData.boards.map(
          (val, index) =>
            index < gameData.numBoards && (
              <div key={index} onClick={() => setSelectedBoardIndex(index)}>
                <GameBoard board={val} preview={true} />
              </div>
            )
        )}
        <div
          className="fake-game-cell"
          onClick={() => setPlayFinalJeopardy(true)}
        >
          Final Jeopardy
        </div>
      </div>
    </div>
  );
}

export default PlayGame;
