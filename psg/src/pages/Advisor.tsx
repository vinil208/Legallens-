import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, Globe, Mic, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamChat, type ChatMessage } from "@/lib/chat";
import { toast } from "@/components/ui/sonner";

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

const quickPrompts = [
  "My employer hasn't paid my salary for 3 months",
  "I want to file an RTI application",
  "Someone encroached on my land",
  "I'm facing domestic violence",
  "I bought a defective product",
  "Police refused to file my FIR",
];

const languages = [
  { code: "English",   label: "English",    speechCode: "en-IN" },
  { code: "Hindi",     label: "हिन्दी",      speechCode: "hi-IN" },
  { code: "Tamil",     label: "தமிழ்",       speechCode: "ta-IN" },
  { code: "Telugu",    label: "తెలుగు",      speechCode: "te-IN" },
  { code: "Kannada",   label: "ಕನ್ನಡ",       speechCode: "kn-IN" },
  { code: "Malayalam", label: "മലയാളം",     speechCode: "ml-IN" },
];

const Advisor = () => {
  const [messages, setMessages]     = useState<ChatMessage[]>([]);
  const [input, setInput]           = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [language, setLanguage]     = useState("English");
  const [langOpen, setLangOpen]     = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const endRef         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input not supported in this browser. Use Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current    = recognition;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = languages.find((l) => l.code === language)?.speechCode ?? "en-IN";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const t = event.results[i][0]?.transcript ?? "";
        if ((event.results[i] as any).isFinal) {
          finalTranscript += t;
        } else {
          interimTranscript += t;
        }
      }
      setInput(finalTranscript || interimTranscript);
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted") toast.error("Could not capture voice. Try again.");
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: updatedMessages,
        language,
        onDelta: upsertAssistant,
        onDone:  () => setIsLoading(false),
        onError: (err) => { toast.error(err); setIsLoading(false); },
      });
    } catch {
      toast.error("Failed to connect. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background">

      {/* ── Header ── */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full saffron-gradient flex items-center justify-center">
              <Bot className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-card-foreground">AI Legal Advisor</h1>
            </div>
          </div>

          {/* Language dropdown */}
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setLangOpen(!langOpen)} className="gap-1.5">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{languages.find((l) => l.code === language)?.label}</span>
            </Button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors ${
                      language === lang.code ? "text-secondary font-semibold" : "text-card-foreground"
                    }`}
                    onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <motion.div className="text-center py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl hero-gradient flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground mb-8">
                Describe your legal issue and I'll guide you with relevant Indian laws and next steps.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-left p-3 rounded-lg border border-border bg-card hover:border-secondary/50 hover:bg-muted/50 transition-all text-sm text-card-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full saffron-gradient flex-shrink-0 flex items-center justify-center mt-1">
                        <Bot className="w-4 h-4 text-secondary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "hero-gradient text-primary-foreground rounded-br-md"
                        : "bg-card text-card-foreground border border-border rounded-bl-md"
                    }`}>
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-card-foreground prose-strong:text-card-foreground prose-p:text-card-foreground prose-li:text-card-foreground">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center mt-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full saffron-gradient flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Analyzing Indian law...</span>
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      {/* ── Input bar ── */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="container mx-auto max-w-3xl">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === "Hindi"  ? "अपनी कानूनी समस्या बताएं..." :
                language === "Tamil"  ? "உங்கள் சட்ட பிரச்சினையை பதிவு செய்யுங்கள்..." :
                "Describe your legal issue..."
              }
              className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <Button type="button" variant="outline" size="icon" onClick={toggleVoiceInput} disabled={isLoading}>
              {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
          {isListening && (
            <p className="text-xs text-destructive mt-1.5 text-center animate-pulse">
              🎙️ Listening in {language}... speak now
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Advisor;
