import "./App.css";
import Login from "./pages/Login";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import FinalSubmission from "./pages/FinalSubmission";
import AccessTokenHandler from "./pages/AccessTokenHandler";
import GameSelector from "./pages/GameSelector";
import EditGame from "./pages/EditGame";
import PlayGame from "./pages/PlayGame";
import JoinParty from "./pages/JoinParty";
import Menu from "./pages/Menu";

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
