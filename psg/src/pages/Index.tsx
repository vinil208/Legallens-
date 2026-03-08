import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, MapPin, Mic, Globe, Shield, Scale, ArrowRight, Users, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-justice.png";

const features = [
  {
    icon: MessageSquare,
    title: "AI Legal Advisor",
    description: "Describe your problem and get instant guidance on relevant laws, procedures, and next steps.",
    link: "/advisor",
  },
  {
    icon: FileText,
    title: "Document Generator",
    description: "Generate RTI applications, legal notices, and complaint letters ready for submission.",
    link: "/documents",
  },
  {
    icon: MapPin,
    title: "Resource Finder",
    description: "Find free legal aid offices, government helplines, and local authorities near you.",
    link: "/resources",
  },
  {
    icon: Mic,
    title: "Voice Input",
    description: "Speak your legal issue in Tamil, Hindi, Telugu, Kannada, or Malayalam.",
    link: "/advisor",
  },
];

const stats = [
  { value: "1B+", label: "Indians lack legal access", icon: Users },
  { value: "6+", label: "Legal areas covered", icon: BookOpen },
  { value: "5+", label: "Languages supported", icon: Globe },
  { value: "100%", label: "Free to use", icon: Shield },
];

const legalAreas = [
  { emoji: "🏠", title: "Land Disputes", law: "Transfer of Property Act, IPC 447" },
  { emoji: "👩", title: "Domestic Violence", law: "DV Act 2005, IPC 498A" },
  { emoji: "📋", title: "RTI Applications", law: "Right to Information Act, 2005" },
  { emoji: "👷", title: "Labour Issues", law: "Minimum Wages Act, EPF Act" },
  { emoji: "🛍️", title: "Consumer Rights", law: "Consumer Protection Act, 2019" },
  { emoji: "🚨", title: "FIR & Complaints", law: "CrPC Section 154, 156(3)" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(30_90%_52%_/_0.12),_transparent_60%)]" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-secondary/30">
                <Scale className="w-4 h-4" />
                AI-Powered Legal Assistant
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
                Know Your Rights.
                <br />
                <span className="text-gradient-saffron">Take Action.</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
                Free AI-powered legal guidance for every Indian citizen. Understand the law, generate documents, and find help — in your language.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/advisor">
                  <Button variant="hero" size="lg" className="gap-2">
                    Get Legal Help <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/resources">
                  <Button variant="hero-outline" size="lg">
                    Find Resources
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="hidden md:flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src={heroImage} alt="Lady Justice" className="w-80 lg:w-96 drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <div className="text-2xl md:text-3xl font-extrabold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              How LegalLens <span className="text-gradient-saffron">Empowers</span> You
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From understanding your rights to taking legal action — all in one platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Link to={f.link}>
                  <div className="group bg-card rounded-xl p-6 card-shadow border border-border hover:border-secondary/50 transition-all hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 rounded-lg saffron-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <f.icon className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-card-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Areas */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Legal Issues We <span className="text-gradient-saffron">Address</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comprehensive coverage of the most common legal challenges faced by Indian citizens.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {legalAreas.map((area, i) => (
              <motion.div
                key={area.title}
                className="bg-card rounded-xl p-5 card-shadow border border-border flex items-start gap-4"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <span className="text-3xl">{area.emoji}</span>
                <div>
                  <h3 className="font-bold text-card-foreground">{area.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{area.law}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-gradient relative">
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
              Justice Should Not Be a Privilege
            </h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">
              Every citizen deserves to know their rights. Start your journey to legal empowerment today.
            </p>
            <Link to="/advisor">
              <Button variant="hero" size="lg" className="gap-2 text-base">
                Talk to AI Legal Advisor <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
