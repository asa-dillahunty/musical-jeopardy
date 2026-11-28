import { useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { AccessToken, AccessTokenExpiration } from "../util/atoms";
import { createBoardFromJSON, getGeminiPrompt } from "../util/gemini";
import { storeGame } from "../util/session";
import { useUserId } from "../util/spotifyAPI";

import styles from "./sass/GameSelector.module.scss";
import "./sass/ImportGame.css";

const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

function isSong(value: unknown): value is { artist: string; song: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "artist" in value &&
    "song" in value &&
    isNonEmptyString(value.artist) &&
    isNonEmptyString(value.song)
  );
}

function parseBoard(input: string) {
  const fenced = input.trim().match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const data = JSON.parse(fenced?.[1] ?? input);
  const numBoards = Object.keys(data).length - 1;
  const cols = data.board1?.categories?.length;
  const rows = data.board1?.categories?.[0]?.songs?.length;

  if (
    numBoards < 1 ||
    numBoards > 3 ||
    !Number.isInteger(cols) ||
    cols < 3 ||
    cols > 6 ||
    !Number.isInteger(rows) ||
    rows < 3 ||
    rows > 5
  ) {
    throw new Error(
      "Use 1–3 boards, 3–6 categories per board, and 3–5 songs per category.",
    );
  }

  for (let index = 1; index <= numBoards; index++) {
    const categories = data[`board${index}`]?.categories;
    if (
      !Array.isArray(categories) ||
      categories.length !== cols ||
      !categories.every(
        (category) =>
          isNonEmptyString(category?.name) &&
          Array.isArray(category.songs) &&
          category.songs.length === rows &&
          category.songs.every(isSong),
      )
    ) {
      throw new Error(
        `Check board${index}. All boards need the same number of named categories and songs. Every song needs a title and artist.`,
      );
    }
  }

  const final = data.finalJeopardy;
  if (!isSong(final) || !("hint" in final) || !isNonEmptyString(final.hint)) {
    throw new Error("Final Jeopardy needs a song title, artist, and hint.");
  }

  return { data, numBoards, cols, rows };
}

export default function ImportGame() {
  const token = useAtomValue(AccessToken);
  const expiration = useAtomValue(AccessTokenExpiration);
  const userId = useUserId();
  const navigate = useNavigate();
  const promptInput = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState(
    () =>
      `${getGeminiPrompt()}\nReturn only the JSON for the requested board sizes. Use consecutive keys starting at board1.`,
  );
  const [jsonInput, setJsonInput] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMessage("Copied to clipboard.");
    } catch {
      promptInput.current?.focus();
      promptInput.current?.select();
      setCopyMessage(
        "The prompt is selected. Copy it using your device’s copy command.",
      );
    }
  };

  const handleImport = async () => {
    setError("");
    let board: ReturnType<typeof parseBoard>;
    try {
      board = parseBoard(jsonInput);
    } catch (err) {
      setError(
        err instanceof SyntaxError ||
          !(err instanceof Error) ||
          err instanceof TypeError
          ? "Paste a JSON object with the board and Final Jeopardy."
          : err.message,
      );
      return;
    }

    if (!token || expiration <= Date.now() || !userId) {
      setError(
        "Sign in to Spotify before importing so the app can look up the songs.",
      );
      return;
    }

    setIsImporting(true);
    try {
      const game = await createBoardFromJSON(
        board.data,
        board.numBoards,
        board.cols,
        board.rows,
        userId,
        token,
      );
      storeGame(game);
      navigate("/edit/new");
    } catch {
      setError(
        "Couldn’t import the game. Check your Spotify connection and the song titles and artists, then try again.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <section className={styles.page} aria-labelledby="import-game-title">
      <Link className={styles.control} to="/edit">
        <FaArrowLeft aria-hidden="true" /> Edit Games
      </Link>
      <header className={styles.header}>
        <h1 id="import-game-title">Import Board</h1>
      </header>
      <div className="import-game-container">
        <section className="import-game-card">
          <h2>
            <label htmlFor="ai-board-prompt">Prompt for your AI</label>
          </h2>
          <div className="import-game-card-body">
            <p>
              Edit the prompt to suit your game, then copy it into the AI of
              your choice.
            </p>
            <textarea
              id="ai-board-prompt"
              ref={promptInput}
              value={prompt}
              onChange={(event) => {
                setPrompt(event.target.value);
                setCopyMessage("");
              }}
            />
            <button
              type="button"
              className={styles.control}
              onClick={handleCopyPrompt}
              disabled={!prompt.trim()}
            >
              Copy Prompt
            </button>
            {copyMessage && <p role="status">{copyMessage}</p>}
          </div>
        </section>
        <section className="import-game-card">
          <h2>
            <label htmlFor="ai-board-json">Board JSON</label>
          </h2>
          <form
            className="import-game-card-body"
            onSubmit={(event) => {
              event.preventDefault();
              void handleImport();
            }}
          >
            <p>
              Paste the AI’s JSON response. Importing opens the board in the
              editor for review.
            </p>
            <textarea
              id="ai-board-json"
              value={jsonInput}
              onChange={(event) => {
                setJsonInput(event.target.value);
                setError("");
              }}
              disabled={isImporting}
            />
            <button
              type="submit"
              className={styles.control}
              disabled={isImporting || !jsonInput.trim()}
            >
              {isImporting ? "Importing…" : "Import Game"}
            </button>
            {isImporting && <p role="status">Looking up songs on Spotify…</p>}
            {error && <p role="alert">{error}</p>}
          </form>
        </section>
      </div>
    </section>
  );
}
