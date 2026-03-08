import { Scale, Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-5 h-5" />
            <span className="text-lg font-bold">LegalLens</span>
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            AI-powered legal assistance for every Indian citizen. Know your rights, take action, get justice.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal Areas</h4>
          <ul className="space-y-1.5 text-sm text-primary-foreground/70">
            <li>Land & Property Disputes</li>
            <li>Domestic Violence</li>
            <li>RTI Applications</li>
            <li>Labour & Wage Issues</li>
            <li>Consumer Complaints</li>
            <li>FIR & Criminal Complaints</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Important Helplines</h4>
          <ul className="space-y-1.5 text-sm text-primary-foreground/70">
            <li>Women Helpline: 181</li>
            <li>Police: 100</li>
            <li>Legal Aid: 15100</li>
            <li>Consumer Helpline: 1800-11-4000</li>
            <li>Labour Helpline: 14434</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-secondary fill-secondary" /> for India
        </p>
        <p className="mt-1">Disclaimer: LegalLens provides general legal information, not professional legal advice.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
