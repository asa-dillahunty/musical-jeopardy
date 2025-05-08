import "./App.css";
import Login from "./pages/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import FinalSubmission from "./pages/FinalSubmission";
import AccessTokenHandler from "./pages/AccessTokenHandler";
import GameSelector from "./pages/GameSelector";
import EditGame from "./pages/EditGame";
import PlayGame from "./pages/PlayGame";
import JoinParty from "./pages/JoinParty";
import Menu from "./pages/Menu";
import AppHeader from "./components/AppHeader";

function App() {
  const location = useLocation();

  const isMobilePage = location.pathname.startsWith("/join");
  return (
    <div className="app">
      {!isMobilePage && <AppHeader />}

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
