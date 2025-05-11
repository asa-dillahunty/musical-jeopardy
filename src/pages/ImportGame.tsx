import { useState, useEffect } from "react";
import "./sass/ImportGame.css";
import {
  createBoardFromJSON,
  getGeminiPrompt,
  validateJeopardyData,
} from "../util/gemini";
import { useAtomValue } from "jotai";
import { AccessToken, AccessTokenExpiration, UserId } from "../util/atoms";
import { useNavigate } from "react-router-dom";
import { storeGame } from "../util/session";

export default function ImportGame() {
  const token = useAtomValue(AccessToken);
  const expiration = useAtomValue(AccessTokenExpiration);
  const userId = useAtomValue(UserId);
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState(getGeminiPrompt);
  const [jsonInput, setJsonInput] = useState("");
  const [isValidJson, setIsValidJson] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      alert("Prompt copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const getBoardProperties = (jsonData) => {
    const numBoards = Object.keys(jsonData).length - 1; // minus 1 for final jeopardy
    const numColumns = jsonData.board1.categories.length;
    const numRows = jsonData.board1.categories[0].songs.length;
    return [numBoards, numColumns, numRows];
  };

  const validateInput = (jsonData) => {
    const [numBoards, numColumns, numRows] = getBoardProperties(jsonData);
    return validateJeopardyData(jsonData, numBoards, numColumns, numRows);
  };

  const handleImport = () => {
    if (!token || token === "" || expiration - Date.now() <= 0) {
      alert("No spotify token, please log in");
      return;
    }
    if (jsonInput.trim() === "") {
      setIsValidJson(false);
      return;
    }
    try {
      const jsonData = JSON.parse(jsonInput);
      if (validateInput(jsonData)) {
        const [numBoards, numColumns, numRows] = getBoardProperties(jsonData);

        createBoardFromJSON(
          jsonData,
          numBoards,
          numColumns,
          numRows,
          userId,
          token
        ).then((gameData) => {
          storeGame(gameData);
          navigate("/edit/new");
        });
      }
    } catch {
      setIsValidJson(false);
    }
  };

  useEffect(() => {
    if (jsonInput.trim() === "") {
      setIsValidJson(false);
      return;
    }
    try {
      const data = JSON.parse(jsonInput);
      setIsValidJson(validateInput(data));
    } catch {
      setIsValidJson(false);
    }
  }, [jsonInput]);

  return (
    <div className="import-game-container">
      <div className="import-game-card">
        <div className="import-game-card-header">
          <h2>Edit and Copy Prompt</h2>
        </div>
        <div className="import-game-card-body">
          <textarea
            className="import-game-textarea"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button className="import-game-button" onClick={handleCopyPrompt}>
            Copy Prompt
          </button>
        </div>
      </div>

      <div className="import-game-card">
        <div className="import-game-card-header">
          <h2>JSON Input & Validation</h2>
        </div>
        <div className="import-game-card-body">
          <textarea
            className="import-game-textarea import-game-textarea-mono"
            placeholder="Paste JSON object here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <button
            className="import-game-button"
            onClick={handleImport}
            disabled={!isValidJson}
          >
            Import Game
          </button>
          <div className="import-game-validation">
            {isValidJson === null && (
              <span>Enter JSON to validate format.</span>
            )}
            {isValidJson === true && (
              <span className="import-game-valid">Valid JSON 🎉</span>
            )}
            {isValidJson === false && (
              <span className="import-game-invalid">Invalid JSON ❌</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
