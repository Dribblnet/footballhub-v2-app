$ErrorActionPreference = 'Stop'
$base = "C:\Users\admin\football-app\v2\src"

function Replace-In-File ($FilePath, $Pattern, $Replacement) {
    $content = Get-Content $FilePath -Raw
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $Pattern, $Replacement)
    if ($content -ne $newContent) {
        Set-Content -Path $FilePath -Value $newContent -NoNewline
        Write-Host "Updated $FilePath"
    }
}

# 1. AuthContext.jsx
$authContext = "$base\context\AuthContext.jsx"
$content = Get-Content $authContext -Raw
$content = $content -replace 'const \[user, setUser\] = useState\(null\);\s*const \[isLoading, setIsLoading\] = useState\(true\);', 'const [user, setUser] = useState(() => { const stored = localStorage.getItem("v2_football_user"); return stored ? JSON.parse(stored) : null; }); const [isLoading, setIsLoading] = useState(false);'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, 'useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);', '')
$content = $content -replace 'import \{ createContext, useState, useContext, useEffect \} from "react";', 'import { createContext, useState, useContext } from "react";'
Set-Content $authContext $content -NoNewline

# 2. PlayerContext.jsx
$playerContext = "$base\context\PlayerContext.jsx"
Replace-In-File $playerContext 'const isDraw = team\.score === opponentScore;' ''

# 3. CountrySelector.jsx
$countrySelector = "$base\features\auth\CountrySelector.jsx"
Replace-In-File $countrySelector 'export const COUNTRIES' 'const COUNTRIES'

# 4. Dashboard.jsx
$dashboard = "$base\features\auth\Dashboard.jsx"
Replace-In-File $dashboard 'const \{ tier, checkPremium \} = useSubscription\(\);\s*' ''
Replace-In-File $dashboard 'Lock, ' ''

# 5. PhoneLogin.jsx
$phoneLogin = "$base\features\auth\PhoneLogin.jsx"
Replace-In-File $phoneLogin 'ShieldAlert, ' ''
Replace-In-File $phoneLogin 'const \{ login, restoreDevSession \} = useAuth\(\);' 'const { login } = useAuth();'
Replace-In-File $phoneLogin 'callback: \(response\) => \{' 'callback: () => {'
Replace-In-File $phoneLogin 'let verified = false;' 'let verified;'
Replace-In-File $phoneLogin 'let verifiedEmail = email;' 'let verifiedEmail;'

# 6. Marketplace.jsx
$marketplace = "$base\features\marketplace\Marketplace.jsx"
Replace-In-File $marketplace 'Search, Users, CalendarClock, Calendar, ' ''
Replace-In-File $marketplace 'Search, Users, CalendarClock, Calendar' ''
# also remove them if they are individually imported or mixed
Replace-In-File $marketplace 'import \{ (.*?)Search,(.*?) \} from "lucide-react";' 'import { $1$2 } from "lucide-react";'
Replace-In-File $marketplace 'import \{ (.*?)Users,(.*?) \} from "lucide-react";' 'import { $1$2 } from "lucide-react";'
Replace-In-File $marketplace 'import \{ (.*?)CalendarClock,(.*?) \} from "lucide-react";' 'import { $1$2 } from "lucide-react";'
Replace-In-File $marketplace 'import \{ (.*?)Calendar(.*?) \} from "lucide-react";' 'import { $1$2 } from "lucide-react";'
Replace-In-File $marketplace 'const i =' '// const i ='

# 7. CreateMatch.jsx
$createMatch = "$base\features\match\CreateMatch.jsx"
Replace-In-File $createMatch 'import \{ useState, useEffect \} from "react";' 'import { useState } from "react";'
Replace-In-File $createMatch 'import \{ useEffect, useState \} from "react";' 'import { useState } from "react";'

# 8. MatchHistory.jsx
$matchHistory = "$base\features\match\MatchHistory.jsx"
Replace-In-File $matchHistory 'const isDraw = teamA\.score === teamB\.score;' ''

# 9. MatchView.jsx
$matchView = "$base\features\match\MatchView.jsx"
Replace-In-File $matchView 'Plus, ' ''
Replace-In-File $matchView 'import \{ ArrowLeft, Play, StopCircle, Clock, Crown, Plus \} from "lucide-react";' 'import { ArrowLeft, Play, StopCircle, Clock, Crown } from "lucide-react";'
$content = Get-Content $matchView -Raw
$content = $content -replace 'if \(!match\.stoppagePromptShown && currentMs >= regulationEndMs - 20000 && currentMs < regulationEndMs\) \{[\s\S]*?markStoppagePromptShown\(id\);[\s\S]*?setStoppageModal\(true\);[\s\S]*?\}', 'if (!match.stoppagePromptShown && currentMs >= regulationEndMs - 20000 && currentMs < regulationEndMs) { markStoppagePromptShown(id); setTimeout(() => setStoppageModal(true), 0); }'
Set-Content $matchView $content -NoNewline

# 10. SubscriptionDashboard.jsx
$subDashboard = "$base\features\monetization\SubscriptionDashboard.jsx"
Replace-In-File $subDashboard 'History, ' ''
Replace-In-File $subDashboard 'import \{ (.*?)History(.*?) \} from "lucide-react";' 'import { $1$2 } from "lucide-react";'

# 11. PlayerProfile.jsx
$playerProfile = "$base\features\teams\PlayerProfile.jsx"
Replace-In-File $playerProfile 'Lock, ' ''
Replace-In-File $playerProfile 'const \{ tier, checkPremium \} = useSubscription\(\);\s*' ''

# 12. LeagueStandings.jsx
$leagueStandings = "$base\features\tournaments\LeagueStandings.jsx"
Replace-In-File $leagueStandings 'ArrowLeft, ' ''
Replace-In-File $leagueStandings 'const navigate = useNavigate\(\);\s*' ''

# 13. TournamentDashboard.jsx
$tournamentDash = "$base\features\tournaments\TournamentDashboard.jsx"
Replace-In-File $tournamentDash 'BarChart, ' ''
Replace-In-File $tournamentDash 'import \{ (.*?)BarChart(.*?) \} from "lucide-react";' 'import { $1$2 } from "lucide-react";'

# 14. TournamentHub.jsx
$tournamentHub = "$base\features\tournaments\TournamentHub.jsx"
Replace-In-File $tournamentHub 'Calendar, ' ''
Replace-In-File $tournamentHub 'import \{ (.*?)Calendar(.*?) \} from "lucide-react";' 'import { $1$2 } from "lucide-react";'

Write-Host "Done"
