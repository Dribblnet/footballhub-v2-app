$ErrorActionPreference = 'Stop'
$base = "C:\Users\admin\football-app\v2\src"

function Replace-In-File ($FilePath, $Pattern, $Replacement) {
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $Pattern, $Replacement)
        if ($content -ne $newContent) {
            Set-Content -Path $FilePath -Value $newContent -NoNewline
            Write-Host "Updated $FilePath"
        }
    }
}

Replace-In-File "$base\context\AuthContext.jsx" 'const \[isLoading, setIsLoading\] = useState\(false\);' 'const [isLoading] = useState(false);'

Replace-In-File "$base\features\auth\Dashboard.jsx" 'import \{ useSubscription \} from "\.\./\.\./context/SubscriptionContext";\s*' ''
Replace-In-File "$base\features\auth\Dashboard.jsx" 'import \{ useSubscription \} from "\.\./monetization/SubscriptionContext";\s*' ''

Replace-In-File "$base\features\marketplace\Marketplace.jsx" 'let i =' 'let _i ='
Replace-In-File "$base\features\marketplace\Marketplace.jsx" 'for \(let i = 0;' 'for (let _i = 0;'

Replace-In-File "$base\features\match\MatchHistory.jsx" 'const isDraw = teamA\.score === teamB\.score;\s*' ''
Replace-In-File "$base\features\match\MatchHistory.jsx" 'const isDraw =[^;]+;\s*' ''

Replace-In-File "$base\features\teams\PlayerProfile.jsx" 'import \{ useSubscription \} from "(.*?)SubscriptionContext";\s*' ''

Replace-In-File "$base\features\tournaments\LeagueStandings.jsx" 'import \{ useNavigate \} from "react-router-dom";\s*' ''
Replace-In-File "$base\features\tournaments\LeagueStandings.jsx" 'import \{\s*useNavigate\s*\} from "react-router-dom";\s*' ''
Replace-In-File "$base\features\tournaments\LeagueStandings.jsx" ',\s*useNavigate' ''
Replace-In-File "$base\features\tournaments\LeagueStandings.jsx" 'useNavigate,\s*' ''
