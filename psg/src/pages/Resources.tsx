import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Building, Search, ExternalLink } from "lucide-react";

interface Resource {
  name: string;
  type: "legal-aid" | "helpline" | "authority";
  phone?: string;
  address?: string;
  url?: string;
}

const states = [
  "All India", "Tamil Nadu", "Maharashtra", "Delhi", "Karnataka", "Uttar Pradesh",
  "Kerala", "Andhra Pradesh", "Telangana", "West Bengal", "Gujarat",
];

const allResources: Record<string, Resource[]> = {
  "All India": [
    { name: "National Legal Services Authority (NALSA)", type: "legal-aid", phone: "15100", address: "12/11 Jamnagar House, New Delhi", url: "https://nalsa.gov.in" },
    { name: "Women Helpline", type: "helpline", phone: "181" },
    { name: "Police Emergency", type: "helpline", phone: "100" },
    { name: "Consumer Helpline", type: "helpline", phone: "1800-11-4000", url: "https://consumerhelpline.gov.in" },
    { name: "Labour Helpline (SHRAM)", type: "helpline", phone: "14434" },
    { name: "Cyber Crime Portal", type: "authority", url: "https://cybercrime.gov.in", phone: "1930" },
    { name: "e-Daakhil (Consumer Court)", type: "authority", url: "https://edaakhil.nic.in" },
    { name: "RTI Online Portal", type: "authority", url: "https://rtionline.gov.in" },
  ],
  "Tamil Nadu": [
    { name: "Tamil Nadu State Legal Services Authority", type: "legal-aid", phone: "044-25340611", address: "High Court Campus, Chennai" },
    { name: "TN Women Helpline", type: "helpline", phone: "181" },
    { name: "TN Labour Commissioner", type: "authority", phone: "044-28524985", address: "DMS Complex, Teynampet, Chennai" },
  ],
  "Maharashtra": [
    { name: "Maharashtra State Legal Services Authority", type: "legal-aid", phone: "022-22622008", address: "High Court, Mumbai" },
    { name: "Mumbai Women's Cell", type: "authority", phone: "022-22633333" },
  ],
  "Delhi": [
    { name: "Delhi State Legal Services Authority", type: "legal-aid", phone: "011-23384781", address: "Patiala House Courts Complex, New Delhi" },
    { name: "Delhi Women Commission", type: "authority", phone: "011-23379150" },
  ],
  "Karnataka": [
    { name: "Karnataka State Legal Services Authority", type: "legal-aid", phone: "080-22110700", address: "High Court of Karnataka, Bangalore" },
  ],
  "Uttar Pradesh": [
    { name: "UP State Legal Services Authority", type: "legal-aid", phone: "0522-2623804", address: "High Court, Lucknow" },
  ],
  "Kerala": [
    { name: "Kerala State Legal Services Authority", type: "legal-aid", phone: "0471-2304358", address: "High Court of Kerala, Ernakulam" },
  ],
};

const typeConfig = {
  "legal-aid": { label: "Legal Aid", color: "bg-primary text-primary-foreground", icon: Building },
  helpline: { label: "Helpline", color: "saffron-gradient text-secondary-foreground", icon: Phone },
  authority: { label: "Authority", color: "bg-success text-success-foreground", icon: MapPin },
};

const Resources = () => {
  const [selectedState, setSelectedState] = useState("All India");
  const [search, setSearch] = useState("");

  const resources = (allResources[selectedState] || []).filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl hero-gradient flex items-center justify-center">
            <MapPin className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Legal Resource Finder</h1>
          <p className="text-muted-foreground">Find free legal aid, helplines, and government offices</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          {resources.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No resources found. Try selecting a different state or clearing your search.</p>
            </div>
          ) : (
            resources.map((r, i) => {
              const cfg = typeConfig[r.type];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={r.name}
                  className="bg-card rounded-xl p-5 card-shadow border border-border flex flex-col sm:flex-row sm:items-center gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className={`w-10 h-10 rounded-lg ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-card-foreground">{r.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{cfg.label}</span>
                    </div>
                    {r.address && <p className="text-sm text-muted-foreground mt-1">{r.address}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {r.phone && (
                      <a href={`tel:${r.phone}`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> {r.phone}
                        </Button>
                      </a>
                    )}
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
