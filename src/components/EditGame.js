import { useEffect, useState } from "react";
import NumberInput from "./NumberInput";
import GameBoard from "./GameBoard";
import { useCreateGame, useGame, useUpdateGame } from "../util/firebaseAPIs";
import ClickBlocker from "./ClickBlocker";
import { SongSelect } from "./SongSelect";
import { getGameFromStorage, storeGame } from "../util/session";

// what's the game object look like?
/*
	Game = {
		id: string,
		name: string,
		numBoards: int,
		boards: Boards[],
	}
*/

// what's the board object look like?
/* 
	Board = {
		cols: int,
		rows: int,
		grid: string[cols][rows] = trackUri,
		// grid here was changed to an object because 
		// firestore does not support nested arrays

		multiplier: int,
		dailyDoubles: int,
	}
*/

export function getNewGame() {
  // new board
  const boardList = Array(3)
    .fill(undefined)
    .map((_val, index) => createNewBoard(index));

  // generate 3 boards
  // boardList.map((val,index) => val = createNewBoard(index));

  const newGame = {
    name: "",
    numBoards: 2,
    boards: boardList,
    finalJeopardy: null,
  };
  return newGame;
}

function createNewBoard(index) {
  // new board
  const boardGrid = createGrid();
  // generate an ID
  const newBoard = {
    cols: 6,
    rows: 5,
    grid: boardGrid,
    multiplier: index + 1,
    dailyDoubles: index + 1,
  };

  return newBoard;
}

function createGrid(oldGrid) {
  const boardGrid = {};

  boardGrid[0] = Array(6).fill(undefined);
  boardGrid[1] = Array(6).fill(undefined);
  boardGrid[2] = Array(6).fill(undefined);
  boardGrid[3] = Array(6).fill(undefined);
  boardGrid[4] = Array(6).fill(undefined);
  boardGrid[5] = Array(6).fill(undefined);

  boardGrid[0][0] = "";
  boardGrid[1][0] = "";
  boardGrid[2][0] = "";
  boardGrid[3][0] = "";
  boardGrid[4][0] = "";
  boardGrid[5][0] = "";

  if (!oldGrid) return boardGrid;
  // else fill with old values
  for (let i = 0; i < boardGrid.length; i++) {
    for (let j = 0; j < boardGrid[i].length; j++) {
      boardGrid[i][j] = oldGrid[i][j];
    }
  }

  return boardGrid;
}

function EditGame({ gameID, token, setChosenGameID, userID }) {
  const [game, setGame] = useState();
  const [numBoards, setNumBoards] = useState();
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [gameName, setGameName] = useState("");
  const [selectingFinalJeopardy, setSelectingFinalJeopardy] = useState(false);
  const [finalJeopardySong, setFinalJeopardySong] = useState(null);
  const [finalJeopardyCategory, setFinalJeopardyCategory] = useState("");

  const { data: gameData, isLoading, isError } = useGame(gameID);
  const createGameMutation = useCreateGame();
  const updateGameMutation = useUpdateGame();

  const updateGame = () => {
    setGame(JSON.parse(JSON.stringify(game)));
  };

  const printGame = () => {
    console.log({ name: gameName, ...game });
  };

  const updateFinalJeopardy = () => {
    game.finalJeopardy = {
      category: finalJeopardyCategory,
      song: finalJeopardySong,
    };
    updateGame();
  };

  const saveGame = () => {
    if (!gameID) {
      createGameMutation.mutateAsync(game).then((gameID) => {
        setChosenGameID(gameID);
      });
    } else {
      updateGameMutation.mutateAsync(game).then(() => {
        console.log("success");
      });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      const currGame = getGameFromStorage();
      if (gameData === null) {
        if (currGame && currGame.id === undefined) {
          setGame(currGame);
          setNumBoards(currGame.numBoards);
          setGameName(currGame.name);
          if (currGame.finalJeopardy) {
            setFinalJeopardyCategory(currGame.finalJeopardy.category);
            setFinalJeopardySong(currGame.finalJeopardy.song);
          }
        } else {
          const newGame = getNewGame(gameID);
          newGame.userID = userID;
          setGame(newGame);
          setNumBoards(newGame.numBoards);
          setGameName(newGame.name);
        }
      } else {
        if (currGame?.id === gameData.id) {
          setGame(currGame);
          setNumBoards(currGame.numBoards);
          setGameName(currGame.name);
          if (currGame.finalJeopardy) {
            setFinalJeopardyCategory(currGame.finalJeopardy.category);
            setFinalJeopardySong(currGame.finalJeopardy.song);
          }
        } else {
          setGame(gameData);
          setNumBoards(gameData.numBoards);
          setGameName(gameData.name);
          if (gameData.finalJeopardy) {
            setFinalJeopardyCategory(gameData.finalJeopardy.category);
            setFinalJeopardySong(gameData.finalJeopardy.song);
          }
        }
      }
    }
  }, [gameID, setGame, setNumBoards, setGameName, gameData, isLoading]);

  useEffect(() => {
    if (game && gameName) {
      game.name = gameName;
      updateGame();
    }
  }, [gameName]);

  useEffect(() => {
    if (game && numBoards) {
      game.numBoards = numBoards;
      updateGame();
    }
  }, [numBoards]);

  useEffect(() => {
    // debounce this so  it doesn't trigger with every keystroke
    const storeGameTimeout = setTimeout(() => {
      storeGame(game);
    }, 2000);
    return () => clearTimeout(storeGameTimeout);
  }, [game]);

  if (isLoading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>Some error. Contact site owner.</p>;
  } else if (!game) {
    return <p>Some error. Contact site owner.</p>;
  }

  if (selectedBoard !== null) {
    return (
      <GameBoard
        board={game.boards[selectedBoard]}
        preview={false}
        token={token}
        updateBoard={updateGame}
        setSelectedBoard={setSelectedBoard}
        editing={true}
      />
    );
  }

  return (
    <div className="edit-game">
      <ClickBlocker custom block={selectingFinalJeopardy}>
        <div className="fake-game-cell category">
          <textarea
            placeholder="Category"
            onChange={(e) => setFinalJeopardyCategory(e.target.value)}
            value={finalJeopardyCategory}
          />
        </div>
        <SongSelect
          token={token}
          onClose={() => {
            setSelectingFinalJeopardy(false);
            updateFinalJeopardy();
          }}
          selectTrack={(track) => setFinalJeopardySong(track)}
          val={finalJeopardySong}
        />
      </ClickBlocker>
      <div>
        <input
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Game Name"
          value={gameName}
        />
      </div>
      <button onClick={saveGame}>Save Game</button>
      <button onClick={printGame}>Pretend Save</button>
      <div className="value-container">
        <NumberInput
          label={"Number of Boards"}
          value={numBoards}
          setValue={setNumBoards}
          maxVal={3}
          minVal={1}
        />
      </div>

      <div className="game-board-list">
        {game.boards.map(
          (val, index) =>
            index < numBoards && (
              <div key={index} onClick={() => setSelectedBoard(index)}>
                <GameBoard board={val} preview={true} />
              </div>
            )
        )}
        <div
          className="fake-game-cell"
          onClick={() => setSelectingFinalJeopardy(true)}
        >
          Final Jeopardy
        </div>
      </div>
    </div>
  );
}

export default EditGame;
