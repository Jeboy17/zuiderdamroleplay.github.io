import { motion } from "framer-motion";
import { Users, Clock, Star } from "lucide-react";

const stats = [
  { icon: Users, value: "5+", label: "Spelers" },
  { icon: Clock, value: "24/7", label: "Online" },
  { icon: Star, value: "5", label: "Beoordeling" },
];

const StatsSection = () => {
  return (
    <section className="py-20 border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-3 max-w-3xl mx-auto gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="font-display text-3xl md:text-4xl font-black text-foreground text-glow mb-1">
                {stat.value}
              </div>
              <div className="font-heading text-sm text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
