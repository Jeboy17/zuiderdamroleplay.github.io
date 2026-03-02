import { motion } from "framer-motion";
import { ChevronDown, Users, Gamepad2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-background/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-wider text-foreground text-glow mb-4">
            ZUIDERDAM
          </h1>
          <p className="font-heading text-2xl md:text-3xl font-semibold text-primary tracking-widest mb-8">
            ROLEPLAY
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-body"
        >
          Welkom bij de meest realistische Nederlandse FiveM roleplay ervaring.
          Bouw je eigen verhaal in de straten van Zuiderdam.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="https://cfx.re"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg gradient-primary text-primary-foreground font-heading font-bold text-lg tracking-wide uppercase shadow-neon hover:opacity-90 transition-all"
          >
            <Gamepad2 className="w-5 h-5" />
            Nu Spelen
          </a>
          <a
            href="https://dcserver.link/zuiderdam"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg glass border-glow text-foreground font-heading font-bold text-lg tracking-wide uppercase hover:bg-secondary transition-all"
          >
            <Users className="w-5 h-5" />
            Discord
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-primary/60" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
