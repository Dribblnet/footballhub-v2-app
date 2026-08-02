import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

const COUNTRIES = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "USA / Canada", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
];

export default function CountrySelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const selected = COUNTRIES.find(c => c.code === value) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "110px", flexShrink: 0 }}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel"
        style={{ 
          display: "flex", alignItems: "center", justifyContent: "space-between", 
          width: "100%", height: "50px", padding: "0 10px",
          border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)",
          fontSize: "14px", cursor: "pointer", color: "white"
        }}
      >
        <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span>{selected.flag}</span>
          <span style={{ fontWeight: "bold" }}>{selected.code}</span>
        </span>
        <ChevronDown size={14} color="var(--text-muted)" />
      </button>

      {isOpen && (
        <div className="glass-panel" style={{ 
          position: "absolute", top: "55px", left: 0, width: "250px", 
          zIndex: 100, background: "rgba(15, 23, 42, 0.95)", border: "1px solid var(--primary)",
          maxHeight: "300px", display: "flex", flexDirection: "column"
        }}>
          <div style={{ padding: "10px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "10px" }} />
              <input 
                type="text"
                autoFocus
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ 
                  width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)",
                  color: "white", padding: "8px 8px 8px 30px", borderRadius: "6px", fontSize: "14px"
                }}
              />
            </div>
          </div>
          
          <div style={{ overflowY: "auto", padding: "5px 0" }}>
            {filteredCountries.map(c => (
              <button 
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setIsOpen(false);
                  setSearch("");
                }}
                style={{ 
                  display: "flex", gap: "10px", width: "100%", padding: "12px 15px",
                  background: "transparent", border: "none", color: "white",
                  textAlign: "left", cursor: "pointer", fontSize: "14px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)"
                }}
              >
                <span>{c.flag}</span>
                <span style={{ flex: 1 }}>{c.name}</span>
                <span style={{ color: "var(--text-muted)", fontWeight: "bold" }}>{c.code}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <p style={{ padding: "15px", textAlign: "center", color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>No countries found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
