import ResponsiveView from "../../components/layout/ResponsiveView";
import PitchMobile from "./components/mobile/PitchMobile";
import PitchTablet from "./components/tablet/PitchTablet";
import PitchDesktop from "./components/desktop/PitchDesktop";
import { useRef } from "react";
import { useMatch } from "../match/MatchContext";

export default function Pitch({ matchId, teamA, teamB }) {
  const { updatePlayerPosition } = useMatch();
  const pitchRef = useRef(null);

  const handleDragStart = (e, team, playerId) => {
    e.dataTransfer.setData("team", team);
    e.dataTransfer.setData("playerId", playerId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const team = e.dataTransfer.getData("team");
    const playerId = e.dataTransfer.getData("playerId");
    
    if (!pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const yPercentage = ((e.clientY - rect.top) / rect.height) * 100;
    const xPercentage = ((e.clientX - rect.left) / rect.width) * 100;

    // Strict boundary enforcement
    if (team === "A" && yPercentage > 50) return;
    if (team === "B" && yPercentage < 50) return;

    updatePlayerPosition(matchId, team, playerId, `${yPercentage}%`, `${xPercentage}%`);
  };

  const renderPlayer = (player, teamColor) => {
    const isRedCarded = player.stats.redCards > 0;
    
    return (
      <div
        key={player.id}
        draggable={!isRedCarded}
        onDragStart={(e) => handleDragStart(e, player.team, player.id)}
        style={{
          position: "absolute",
          top: player.top,
          left: player.left,
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: isRedCarded ? "not-allowed" : "grab",
          opacity: isRedCarded ? 0.3 : 1,
          transition: "top 0.3s ease, left 0.3s ease",
          zIndex: 10
        }}
      >
        <div style={{
          width: "32px",
          height: "32px",
          backgroundColor: isRedCarded ? "var(--danger)" : teamColor,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isRedCarded ? "white" : "black",
          fontWeight: "800",
          fontSize: "12px",
          border: "2px solid rgba(255,255,255,0.9)",
          boxShadow: "0 4px 6px rgba(0,0,0,0.4)"
        }}>
          {player.name.split(" ")[1] ? player.name.split(" ")[1][0].toUpperCase() : player.name[0].toUpperCase()}
        </div>
        
        <div style={{
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "10px",
          fontWeight: "600",
          whiteSpace: "nowrap",
          marginTop: "4px"
        }}>
          {player.name.split(" ")[1] || player.name.slice(0, 3)}
          {player.isCaptain && <span style={{ color: "var(--warning)", marginLeft: "4px" }} title="Captain">(C)</span>}
          {player.position === "GK" && <span style={{ color: "var(--accent)", marginLeft: "4px" }} title="Goalkeeper">(GK)</span>}
        </div>
      </div>
    );
  };


  const controllerProps = {
    matchId,
    teamA,
    teamB,
    updatePlayerPosition,
    pitchRef,
    handleDragStart,
    handleDragOver,
    handleDrop,
    renderPlayer
  };

  return (
    <ResponsiveView
      mobile={<PitchMobile {...controllerProps} />}
      tablet={<PitchTablet {...controllerProps} />}
      desktop={<PitchDesktop {...controllerProps} />}
    />
  );
}
