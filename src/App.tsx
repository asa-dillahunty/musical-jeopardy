import "./App.css";
import Login from "./pages/Login";
import Login4 from "./pages/Login4";
import Login5 from "./pages/Login5";
import Login6 from "./pages/Login6";
import Login7 from "./pages/Login7";
import Login8 from "./pages/Login8";
import Login9 from "./pages/Login9";
import Login10 from "./pages/Login10";
import Login11 from "./pages/Login11";
import Login12 from "./pages/Login12";
import Login13 from "./pages/Login13";
import Login14 from "./pages/Login14";
import Login15 from "./pages/Login15";
import Login16 from "./pages/Login16";
import Login17 from "./pages/Login17";
import Login18 from "./pages/Login18";
import Login19 from "./pages/Login19";
import Login20 from "./pages/Login20";
import { Route, Routes, useLocation } from "react-router-dom";
import FinalSubmission from "./pages/FinalSubmission";
import AccessTokenHandler from "./pages/AccessTokenHandler";
import PlayGameSelector from "./pages/PlayGameSelector";
import EditGameSelector from "./pages/EditGameSelector";
import EditGame from "./pages/EditGame";
import PlayGame from "./pages/PlayGame";
import JoinParty from "./pages/JoinParty";
import Menu from "./pages/Menu";
import AppHeader from "./components/AppHeader";
import ImportGame from "./pages/ImportGame";
import { isLocalEnv } from "./util/konami";
import TestPage from "./pages/TestPage";
import LostPage from "./pages/LostPage";

function App() {
  const location = useLocation();

  const isMobilePage = location.pathname.startsWith("/join");
  return (
    <div className="app">
      {!isMobilePage && <AppHeader />}

      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login1" element={<Login variant="record" />} />
          <Route path="/login2" element={<Login variant="ticket" />} />
          <Route path="/login3" element={<Login variant="poster" />} />
          <Route path="/login4" element={<Login4 />} />
          <Route path="/login5" element={<Login5 />} />
          <Route path="/login6" element={<Login6 />} />
          <Route path="/login7" element={<Login7 />} />
          <Route path="/login8" element={<Login8 />} />
          <Route path="/login9" element={<Login9 />} />
          <Route path="/login10" element={<Login10 />} />
          <Route path="/login11" element={<Login11 />} />
          <Route path="/login12" element={<Login12 />} />
          <Route path="/login13" element={<Login13 />} />
          <Route path="/login14" element={<Login14 />} />
          <Route path="/login15" element={<Login15 />} />
          <Route path="/login16" element={<Login16 />} />
          <Route path="/login17" element={<Login17 />} />
          <Route path="/login18" element={<Login18 />} />
          <Route path="/login19" element={<Login19 />} />
          <Route path="/login20" element={<Login20 />} />
          <Route path="/callback" element={<AccessTokenHandler />} />
          <Route path="/menu" element={<Menu />} />

          <Route path="/play" element={<PlayGameSelector />} />
          <Route path="/play/:gameId" element={<PlayGame />} />

          <Route path="/edit" element={<EditGameSelector />} />
          <Route path="/edit/:gameId" element={<EditGame />} />

          <Route path="/join" element={<JoinParty />} />
          <Route path="/join/:partyId" element={<FinalSubmission />} />

          <Route path="/import" element={<ImportGame />} />

          {isLocalEnv() && <Route path="/test" element={<TestPage />} />}
          <Route path="*" element={<LostPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
