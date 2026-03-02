import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Welkom", href: "/" },
  { label: "Server Info", href: "/server-info" },
  { label: "Regels", href: "/regels" },
  { label: "Staff", href: "/staff" },
  { label: "Doneren", href: "/doneren" },
  { label: "Solliciteren", href: "/solliciteren" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-neon">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display text-lg tracking-wider text-foreground group-hover:text-primary transition-colors">
            ZUIDERDAM
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-4 py-2 rounded-md text-sm font-heading font-semibold tracking-wide uppercase transition-all duration-300 ${
                location.pathname === item.href
                  ? "text-primary bg-primary/10 border-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="ml-4 px-4 py-2 rounded-md text-sm font-heading font-semibold tracking-wide uppercase gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Dev Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground p-2"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-heading font-semibold tracking-wide uppercase transition-all ${
                    location.pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-md text-sm font-heading font-semibold tracking-wide uppercase gradient-primary text-primary-foreground text-center"
              >
                Dev Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
