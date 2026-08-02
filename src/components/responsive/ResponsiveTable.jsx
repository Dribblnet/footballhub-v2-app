import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function ResponsiveTable({ columns, data, keyExtractor }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {data.map((row, index) => (
          <div 
            key={keyExtractor ? keyExtractor(row) : index} 
            style={{ 
              background: "rgba(255,255,255,0.05)", 
              borderRadius: "12px", 
              padding: "15px",
              border: "1px solid var(--border)"
            }}
          >
            {columns.map((col, cIndex) => (
              <div 
                key={col.key || cIndex} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  marginBottom: cIndex === columns.length - 1 ? 0 : "8px",
                  fontSize: "14px"
                }}
              >
                <span style={{ color: "var(--text-muted)", fontWeight: "bold" }}>{col.label}</span>
                <span style={{ textAlign: "right", wordBreak: "break-word" }}>
                  {col.render ? col.render(row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
        {data.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
            No data available.
          </div>
        )}
      </div>
    );
  }

  // Desktop Table
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {columns.map((col, index) => (
              <th key={col.key || index} style={{ padding: "12px", color: "var(--text-muted)", fontWeight: "bold", fontSize: "12px", textTransform: "uppercase" }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={keyExtractor ? keyExtractor(row) : index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              {columns.map((col, cIndex) => (
                <td key={col.key || cIndex} style={{ padding: "16px 12px", fontSize: "14px" }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
          No data available.
        </div>
      )}
    </div>
  );
}
