import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MatchProvider } from "./features/match/MatchContext";
import { PlayerProvider } from "./context/PlayerContext";
import { TeamProvider } from "./context/TeamContext";
import { TournamentProvider } from "./context/TournamentContext";
import { MessageProvider } from "./context/MessageContext";
import Dashboard from "./features/auth/Dashboard";
import MatchView from "./features/match/MatchView";
import MatchHistory from "./features/match/MatchHistory";
import MatchReport from "./features/match/MatchReport";
import CreateMatch from "./features/match/CreateMatch";
import AuthPage from "./features/auth/AuthPage";
import PlayerProfile from "./features/teams/PlayerProfile";
import TeamProfile from "./features/teams/TeamProfile";
import CreateTeam from "./features/teams/CreateTeam";
import MyTeams from "./features/teams/MyTeams";
import CreateTournament from "./features/tournaments/CreateTournament";
import TournamentDashboard from "./features/tournaments/TournamentDashboard";
import TournamentHub from "./features/tournaments/TournamentHub";
import StatsHub from "./features/stats/StatsHub";
import Marketplace from "./features/marketplace/Marketplace";
import Messages from "./features/marketplace/Messages";
import GlobalPlayerSearch from "./features/search/GlobalPlayerSearch";
import Policies from "./features/policies/Policies";
import About from "./features/policies/About";
import SafetyCenter from "./features/policies/SafetyCenter";
import Settings from "./features/auth/Settings";
import FeedbackDashboard from "./features/admin/FeedbackDashboard";
import { ToastProvider } from "./context/ToastContext";
import { NotificationProvider } from "./context/NotificationContext";
import { MarketProvider } from "./features/marketplace/MarketContext";
import AppLayout from "./components/layout/AppLayout";
import ScrollToTop from "./components/layout/ScrollToTop";

import SplashScreen from "./components/layout/SplashScreen";
import "./styles/global.css";
import { useState } from "react";
function AuthGate({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <AuthPage />;
  }
  
  return children;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
        <TeamProvider>
          <TournamentProvider>
            <PlayerProvider>
              <MatchProvider>
                <MessageProvider>
                  <ToastProvider>
                    <NotificationProvider>
                    <MarketProvider>
                      <BrowserRouter>
                        <ScrollToTop />
                        {showSplash ? <SplashScreen onFinish={() => setShowSplash(false)} /> : null}
                        <AuthGate>
                    <AppLayout>
                      <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/create-match" element={<CreateMatch />} />
                      <Route path="/match/:id" element={<MatchView />} />
                      <Route path="/match-report/:id" element={<MatchReport />} />
                      <Route path="/history" element={<MatchHistory />} />
                      <Route path="/player/:id" element={<PlayerProfile />} />
                      <Route path="/team/:id" element={<TeamProfile />} />
                      <Route path="/create-team" element={<CreateTeam />} />
                      <Route path="/teams" element={<MyTeams />} />
                      <Route path="/create-tournament" element={<CreateTournament />} />
                      <Route path="/tournaments" element={<TournamentHub />} />
                      <Route path="/tournament/:id" element={<TournamentDashboard />} />
                      
                      <Route path="/stats" element={<StatsHub />} />
              <Route path="/leaderboards" element={<StatsHub />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/search" element={<GlobalPlayerSearch />} />
                      {/* <Route path="/turfs" element={<TurfFinder />} /> */}
                      <Route path="/policies" element={<Policies />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/safety" element={<SafetyCenter />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/admin/feedback" element={<FeedbackDashboard />} />
                      
                        {/* Redirect /matches/live to dashboard for MVP ease */}
                        <Route path="/matches/live" element={<Dashboard />} />
                      </Routes>
                    </AppLayout>
                  </AuthGate>
                </BrowserRouter>
                    </MarketProvider>
                    </NotificationProvider>
                  </ToastProvider>
                </MessageProvider>
              </MatchProvider>
            </PlayerProvider>
          </TournamentProvider>
        </TeamProvider>
    </AuthProvider>
  );
}

export default App;
