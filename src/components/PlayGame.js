import "./PlayGame.css";
import { useEffect, useRef, useState } from "react";
import NumberInput from "./NumberInput";
import GameBoard from "./GameBoard";
import { useGame } from "../util/firebaseAPIs";
import ClickBlocker from "./ClickBlocker";
import {
  getGameSessionFromStorage,
  numPlayersSignal,
  playersSignal,
  storeGameSession,
  updatePlayerName,
  updatePlayerScore,
} from "../util/session";
import FinalJeopardy from "./FinalJeopardy";
import { ScoreBoard } from "./ScoreBoard";

// const players = [
// 	{ name: "Player 1", color: "red" },
// 	{ name: "Player 2", color: "blue" },
// 	{ name: "Player 3", color: "yellow" },
// 	{ name: "Player 4", color: "green" },
// 	{ name: "Player 5", color: "black" },
// 	{ name: "Player 6", color: "white" },
// 	{ name: "Player 7", color: "pink" },
// 	{ name: "Player 8", color: "purple" },
// 	{ name: "Player 9", color: "orange" },
// ]

function PlayGame({ gameID, token, setChosenGameID }) {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [playFinalJeopardy, setPlayFinalJeopardy] = useState(false);
  const { data: gameData, isLoading, isError } = useGame(gameID);
  const [playersInitialized, setPlayersInitialized] = useState(false);
  const [revealedCards, setRevealedCards] = useState([{}, {}, {}]);
  const [showScoreBoard, setShowScoreBoard] = useState(false);

  // useEffect(() => {
  // 	if (!isLoading) {
  // 		setSelectedBoard(0);
  // 	}
  // }, [isLoading]);

  const playNextState = () => {
    if (selectedBoard === gameData.numBoards - 1) {
      setSelectedBoard(null);
      setPlayFinalJeopardy(true);
    } else {
      setSelectedBoard(selectedBoard + 1);
    }
  };

  const onFinishFinalJeopardy = () => {
    setPlayFinalJeopardy(false);
    setShowScoreBoard(true);
  };

  const updateSessionStorage = () => {
    const sessionData = {
      id: gameID,
      selectedBoard: selectedBoard,
      playFinalJeopardy: playFinalJeopardy,
      playersInitialized: playersInitialized,
      revealedCards: revealedCards,
    };
    storeGameSession(sessionData);
  };

  const updateRevealed = () => {
    setRevealedCards(JSON.parse(JSON.stringify(revealedCards)));
    updateSessionStorage();
  };

  useEffect(() => {
    // load from storage the active session
    const sessionData = getGameSessionFromStorage();
    if (sessionData?.id !== gameID) return;

    setSelectedBoard(sessionData.selectedBoard);
    setPlayFinalJeopardy(sessionData.playFinalJeopardy);
    setPlayersInitialized(sessionData.playersInitialized);
    setRevealedCards(sessionData.revealedCards);
  }, [gameID]);

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
        token={token}
        songData={gameData.finalJeopardy}
        onFinish={onFinishFinalJeopardy}
      />
    );
  } else if (selectedBoard !== null) {
    return (
      <GameBoard
        board={gameData.boards[selectedBoard]}
        preview={false}
        token={token}
        setSelectedBoard={setSelectedBoard}
        editing={false}
        playNextBoard={playNextState}
        revealedCards={revealedCards[selectedBoard]}
        updateRevealed={updateRevealed}
      />
    );
  }
  return (
    <div className="edit-game">
      <div>
        <p>{gameData.name}</p>
      </div>

      <div className="game-board-list">
        {gameData.boards.map(
          (val, index) =>
            index < gameData.numBoards && (
              <div key={index} onClick={() => setSelectedBoard(index)}>
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

function PlayerSetup({ setPlayersInitialized }) {
  const [editing, setEditing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [numPlayers, setNumPlayers] = useState(numPlayersSignal.value);

  const openEdit = (player) => {
    setEditing(true);
    setSelectedPlayer(player);
  };

  const finishSetup = () => {
    numPlayersSignal.value = numPlayers;
    setPlayersInitialized(true);
  };

  return (
    <div className="player-setup-wrapper">
      <ClickBlocker custom block={editing}>
        <PlayerEdit selectedPlayer={selectedPlayer} setEditing={setEditing} />
      </ClickBlocker>
      <NumberInput
        label={"Total Players"}
        value={numPlayers}
        setValue={setNumPlayers}
        maxVal={playersSignal.value.length}
        minVal={1}
      />
      <PlayerContainer onClickPlayer={openEdit} numPlayers={numPlayers} />
      <button onClick={() => finishSetup()} className="ready-button">
        Ready
      </button>
    </div>
  );
}

export function PlayerContainer({
  onClickPlayer,
  numPlayers,
  isPlaying,
  isSidebar,
  selectedPlayer,
  isFinalJeopardy,
}) {
  if (!numPlayers) numPlayers = numPlayersSignal.value;
  const className = isSidebar ? "player-container sidebar" : "player-container";

  return (
    <div className={className}>
      {playersSignal.value.map((player, index) => {
        return (
          <PlayerDisplay
            data={player}
            display={index < numPlayers}
            onClickPlayer={onClickPlayer}
            isPlaying={isPlaying}
            selectedPlayer={selectedPlayer}
            key={index}
            isFinalJeopardy={isFinalJeopardy}
          />
        );
      })}
    </div>
  );
}

const rewardState = {
  success: "success",
  fail: "fail",
  neutral: "neutral",
};

export function PlayerDisplay({
  data,
  display,
  onClickPlayer,
  isPlaying,
  selectedPlayer,
  isFinalJeopardy,
}) {
  const [rewardStatus, setRewardStatus] = useState(rewardState.neutral);
  const [wager, setWager] = useState(500);
  let className = "player-icon-wrapper";
  if (onClickPlayer) className += " selectable";
  if (rewardStatus === rewardState.fail) className += " fail";
  if (rewardStatus === rewardState.success) className += " success";
  if (selectedPlayer?.index === data.index) className += " selected";

  const handleClick = () => {
    if (!onClickPlayer) return;

    if (!isPlaying) {
      onClickPlayer(data);
      return;
    } else {
      onClickPlayer(data, rewardStatus);
    }

    if (rewardStatus === rewardState.neutral)
      setRewardStatus(rewardState.success);
    else if (rewardStatus === rewardState.success)
      setRewardStatus(rewardState.fail);
    else if (rewardStatus === rewardState.fail)
      setRewardStatus(rewardState.neutral);
  };

  const winWager = () => {
    updatePlayerScore(
      data.index,
      playersSignal.value[data.index].score + wager
    );
    // setSelectedCard({});
  };

  const loseWager = () => {
    updatePlayerScore(
      data.index,
      playersSignal.value[data.index].score - wager
    );
    // setSelectedCard({});
  };

  const currentScore = playersSignal?.value[data.index]?.score ?? 0;

  useEffect(() => {
    if (onClickPlayer) return;
    setRewardStatus(rewardState.neutral);
  }, [onClickPlayer]);

  return (
    <div
      className={className}
      style={display ? {} : { display: "none" }}
      onClick={handleClick}
    >
      <PlayerIcon color={data.color} />
      <p className="player-name">{data.name}</p>
      {isPlaying && (
        <>
          <p className="player-score">${currentScore}</p>
        </>
      )}
      {isFinalJeopardy && (
        <>
          <NumberInput
            label={"Wager"}
            value={wager}
            setValue={setWager}
            minVal={0}
            maxVal={currentScore > 500 ? currentScore : 500}
            incPerDigit
            topLabel
            includePlusMinus
            plusFunc={winWager}
            minusFunc={loseWager}
          />
        </>
      )}
    </div>
  );
}

function PlayerIcon({ color }) {
  return <div className="player-icon" style={{ backgroundColor: color }}></div>;
}

function PlayerEdit({ selectedPlayer, setEditing }) {
  const [playerName, setPlayerName] = useState(selectedPlayer?.name);

  const inputRef = useRef(null);

  const attemptSave = (name) => {
    if (name.trim() === "") return;
    updatePlayerName(selectedPlayer.index, name.trim().slice(0, 10).trim());
    setEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      attemptSave(playerName);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  return (
    <div className="player-edit">
      <PlayerIcon color={selectedPlayer.color} />
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
