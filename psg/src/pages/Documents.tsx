import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Download, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import { generateAndDownloadDoc } from "@/lib/docGenerator";
import { toast } from "@/components/ui/sonner";

interface DocTemplate {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  icon: string;
  fields: { name: string; label: string; type: string; placeholder: string }[];
}

const templates: DocTemplate[] = [
  {
    id: "rti",
    title: "RTI Application",
    titleHi: "आरटीआई आवेदन",
    description: "Request information from any government department under the Right to Information Act, 2005.",
    icon: "📋",
    fields: [
      { name: "name", label: "Your Full Name", type: "text", placeholder: "Enter your full name" },
      { name: "address", label: "Your Address", type: "text", placeholder: "Enter your complete address" },
      { name: "department", label: "Government Department", type: "text", placeholder: "e.g., Municipal Corporation" },
      { name: "information", label: "Information Required", type: "textarea", placeholder: "Describe the information you need..." },
    ],
  },
  {
    id: "legal-notice",
    title: "Legal Notice",
    titleHi: "कानूनी नोटिस",
    description: "Send a formal legal notice to an individual or organization demanding action.",
    icon: "⚖️",
    fields: [
      { name: "sender", label: "Your Full Name", type: "text", placeholder: "Enter your name" },
      { name: "recipient", label: "Recipient Name/Organization", type: "text", placeholder: "Enter recipient's name" },
      { name: "subject", label: "Subject of Notice", type: "text", placeholder: "e.g., Non-payment of salary" },
      { name: "details", label: "Details of Grievance", type: "textarea", placeholder: "Describe the issue in detail..." },
    ],
  },
  {
    id: "complaint",
    title: "Complaint Letter",
    titleHi: "शिकायत पत्र",
    description: "File a formal complaint to the police, consumer forum, or any authority.",
    icon: "🚨",
    fields: [
      { name: "complainant", label: "Your Full Name", type: "text", placeholder: "Enter your name" },
      { name: "authority", label: "Addressed To", type: "text", placeholder: "e.g., Station House Officer" },
      { name: "incident", label: "Date of Incident", type: "text", placeholder: "DD/MM/YYYY" },
      { name: "description", label: "Description of Complaint", type: "textarea", placeholder: "Describe the incident..." },
    ],
  },
];

const Documents = () => {
  const [selected, setSelected] = useState<DocTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleDownload = async () => {
    if (!selected) return;
    setDownloading(true);
    try {
      await generateAndDownloadDoc({
        templateId: selected.id,
        templateTitle: selected.title,
        fields: formData,
      });
      toast.success("Document downloaded successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate document.");
    } finally {
      setDownloading(false);
    }
  };

  const handleBack = () => {
    setSelected(null);
    setFormData({});
    setGenerated(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {!selected ? (
          <>
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl saffron-gradient flex items-center justify-center">
                <FileText className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h1 className="text-3xl font-extrabold text-foreground mb-2">Document Generator</h1>
              <p className="text-muted-foreground">Generate ready-to-use legal documents instantly</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {templates.map((t, i) => (
                <motion.button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="text-left bg-card rounded-xl p-6 card-shadow border border-border hover:border-secondary/50 transition-all hover:-translate-y-1 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-4xl block mb-4">{t.icon}</span>
                  <h3 className="text-lg font-bold text-card-foreground mb-1">{t.title}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{t.titleHi}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">{t.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-sm font-medium text-secondary group-hover:gap-2 transition-all">
                    Generate <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1">
              ← Back to templates
            </button>

            <div className="bg-card rounded-xl p-6 md:p-8 card-shadow border border-border">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{selected.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">{selected.title}</h2>
                  <p className="text-sm text-muted-foreground">{selected.titleHi}</p>
                </div>
              </div>

              {!generated ? (
                <div className="space-y-5">
                  {selected.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-card-foreground mb-1.5">{field.label}</label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={formData[field.name] || ""}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.name] || ""}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      )}
                    </div>
                  ))}

                  <Button onClick={handleGenerate} className="w-full gap-2" size="lg">
                    <FileText className="w-4 h-4" /> Generate Document
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Document Generated!</h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Your {selected.title} has been prepared and is ready for download.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="hero" size="lg" className="gap-2" onClick={handleDownload} disabled={downloading}>
                      {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {downloading ? "Generating..." : "Download as Word"}
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleBack}>
                      Generate Another
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Documents;
