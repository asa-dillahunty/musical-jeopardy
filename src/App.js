import "./App.css";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { getTokenFromUrl, getUserId } from "./util/spotifyAPI";
import Menu, { menuOptions } from "./components/Menu";
import { markEvent } from "./util/firebaseAPIs";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import FinalSubmission from "./components/FinalSubmission";
import AccessTokenHandler from "./components/AccessTokenHandler";
import GameSelector from "./components/GameSelector";
import EditGame from "./components/EditGame";
import PlayGame from "./components/PlayGame";
import JoinParty from "./components/JoinParty";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobilePage = location.pathname.startsWith("/join");
  return (
    <div className="app">
      {!isMobilePage && (
        <header className="app-header">
          <button onClick={() => localStorage.clear()}>
            clear local storage
          </button>
          <span onClick={() => navigate("/menu")} className="header-title">
            MUSICAL JEOPARDY
          </span>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/callback" element={<AccessTokenHandler />} />
          <Route path="/menu" element={<Menu />} />

          <Route path="/play" element={<GameSelector />} />
          <Route path="/play/:gameId" element={<PlayGame />} />

          <Route path="/edit" element={<GameSelector editing />} />
          <Route path="/edit/:gameId" element={<EditGame />} />

          <Route path="/join" element={<JoinParty />} />
          <Route path="/join/:partyId" element={<FinalSubmission />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
