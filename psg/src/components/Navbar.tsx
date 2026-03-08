import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, Menu, X, Globe } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/advisor", label: "AI Advisor" },
  { to: "/documents", label: "Documents" },
  { to: "/resources", label: "Resources" },
];

const languages = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "മലയാളം"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Legal<span className="text-gradient-saffron">Lens</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant={location.pathname === link.to ? "default" : "ghost"}
                size="sm"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setLangOpen(!langOpen)} className="gap-1.5">
              <Globe className="w-4 h-4" />
              {selectedLang}
            </Button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors text-card-foreground"
                    onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
              <Button variant={location.pathname === link.to ? "default" : "ghost"} className="w-full justify-start" size="sm">
                {link.label}
              </Button>
            </Link>
          ))}
          <div className="pt-2 flex flex-wrap gap-1">
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={selectedLang === lang ? "secondary" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setSelectedLang(lang)}
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
