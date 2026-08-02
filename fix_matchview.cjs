const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/features/match/components/mobile/MatchViewMobile.jsx");
let content = fs.readFileSync(filePath, "utf-8");

const brokenBlock = `<div className="glass-panel" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "center", alignItems: "center", padding: "15px", gap: isMobile ? "15px" : "0" }}>
                <option value="3-3-1">3-3-1</option>`;

const fixedBlock = `<div className="glass-panel" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "center", alignItems: "center", padding: "15px", gap: isMobile ? "15px" : "0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: isMobile ? "100%" : "auto" }}>
              <span style={{ fontWeight: "700" }}>{match.teamA.name}</span>
              <select 
                className="input-modern" 
                style={{ width: "100%" }}
                value={match.teamA.formation || ""}
                onChange={(e) => changeFormation(id, "A", e.target.value)}
                disabled={match.state === "FINISHED"}
              >
                <option value="" disabled>Setup</option>
                <option value="3-1-2">3-1-2</option>
                <option value="3-2-1">3-2-1</option>
                <option value="3-2-2">3-2-2</option>
                <option value="3-3-1">3-3-1</option>`;

content = content.replace(brokenBlock, fixedBlock);

// I also need to fix the buttons array closing tags that got deleted.
// At line 344 it says:
//             {tab}
//           </button>
//       {/* TAB CONTENT */}

// Wait, the original had:
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

content = content.replace(
`          >
            {tab}
          </button>
      {/* TAB CONTENT */}`,
`          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}`
);

fs.writeFileSync(filePath, content);
console.log("Fixed MatchViewMobile.jsx");
