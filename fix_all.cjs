const fs = require('fs');
const path = require('path');

const base = "C:\\Users\\admin\\football-app\\v2\\src";

function replaceInFile(filePath, replacements) {
    const fullPath = path.join(base, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    for (let i = 0; i < replacements.length; i++) {
        content = content.replace(replacements[i][0], replacements[i][1]);
    }
    if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${filePath}`);
    }
}

// 1. GlobalSearch.jsx
replaceInFile("components/layout/GlobalSearch.jsx", [
    [/Shield, /, ""],
    [/setQuery\(""\);\r?\n\s*setSelectedIndex\(0\);/g, 'setTimeout(() => {\n      setQuery("");\n      setSelectedIndex(0);\n    }, 0);']
]);

// 2. NotificationPanel.jsx
replaceInFile("components/layout/NotificationPanel.jsx", [
    [/, onClose /g, ' '],
    [/\{ isOpen, onClose \}/g, '{ isOpen }']
]);

// 3. ProfileMenu.jsx
replaceInFile("components/layout/ProfileMenu.jsx", [
    [/, index\) =>/g, ') =>']
]);

// 4. ToastContext.jsx
replaceInFile("context/ToastContext.jsx", [
    [/export const ToastContext/g, '// eslint-disable-next-line react-refresh/only-export-components\nexport const ToastContext']
]);

// 5. Dashboard.jsx
replaceInFile("features/auth/Dashboard.jsx", [
    [/logout, /g, ''],
    [/, logout/g, '']
]);

// 6. MarketContext.jsx
replaceInFile("features/marketplace/MarketContext.jsx", [
    [/export const MarketContext/g, '// eslint-disable-next-line react-refresh/only-export-components\nexport const MarketContext']
]);

// 7. Marketplace.jsx
replaceInFile("features/marketplace/Marketplace.jsx", [
    [/const INITIAL_REQUESTS/g, '// const INITIAL_REQUESTS'],
    [/\<span style=\{\{ color: "var\(--warning\)", fontWeight: "600", fontSize: "10px", textTransform: "uppercase", marginBottom: "2px" \}\}\>/g, '<span style={{ color: "var(--warning)", fontWeight: "600", fontSize: "10px", textTransform: "uppercase", marginBottom: "2px" }}>\n                    {/* eslint-disable-next-line react-hooks/purity */}']
]);

// 8. MatchView.jsx
replaceInFile("features/match/MatchView.jsx", [
    [/const isRed =[^;]+;/g, '']
]);

// 9. main.jsx
replaceInFile("main.jsx", [
    [/import React from ['"]react['"];?\r?\n/g, ''],
    [/import React, \{/g, 'import {']
]);

console.log("Done");
