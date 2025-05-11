import { useState, useEffect } from "react";
import "./sass/ImportGame.css";
import { getGeminiPrompt, validateJeopardyData } from "../util/gemini";

export default function ImportGame() {
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

  const validateInput = (jsonObj) => {
    console.log("here", jsonObj);
    // count num boards, columns, rows
    let numBoards = 1;
    if (jsonObj.board2) {
      numBoards = 2;
    }
    if (jsonObj.board3) {
      numBoards = 3;
    }

    const numColumns = jsonObj.board1.categories.length;
    const numRows = jsonObj.board1.categories.songs.length;

    console.log(numBoards, numColumns, numRows);

    return validateJeopardyData(jsonObj, numBoards, numColumns, numRows);
  };

  useEffect(() => {
    if (jsonInput.trim() === "") {
      setIsValidJson(false);
      return;
    }
    try {
      const data = JSON.parse(jsonInput);
      console.log("trying validation");
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
            onClick={handleCopyPrompt}
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
