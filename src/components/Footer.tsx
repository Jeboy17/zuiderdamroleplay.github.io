import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-sm tracking-wider text-foreground">
              ZUIDERDAM ROLEPLAY
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground font-heading">
            <Link to="/regels" className="hover:text-primary transition-colors">Regels</Link>
            <Link to="/server-info" className="hover:text-primary transition-colors">Server Info</Link>
            <Link to="/doneren" className="hover:text-primary transition-colors">Doneren</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Developers</Link>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 Zuiderdam Roleplay. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
