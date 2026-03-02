import { motion } from "framer-motion";
import { Shield, Car, Briefcase, Building2, Siren, HandCoins } from "lucide-react";
import featuresBg from "@/assets/features-bg.png";

const features = [
  {
    icon: Shield,
    title: "Politie & Justitie",
    description: "Sluit je aan bij het korps en bescherm de straten van Zuiderdam.",
  },
  {
    icon: Siren,
    title: "Ambulance",
    description: "Red levens als paramedicus in spannende medische scenario's.",
  },
  {
    icon: Car,
    title: "Unieke Voertuigen",
    description: "Honderden Nederlandse voertuigen met realistische handling.",
  },
  {
    icon: Briefcase,
    title: "Banen & Economie",
    description: "Een volledig werkende economie met diverse beroepen.",
  },
  {
    icon: Building2,
    title: "Vastgoed",
    description: "Koop je eigen woning of appartement in de stad.",
  },
  {
    icon: HandCoins,
    title: "Crimineel Leven",
    description: "Bouw een onderwereld imperium of werk je omhoog in de maffia.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Subtle bg */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${featuresBg})` }}
      />
      <div className="absolute inset-0 bg-background/95" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider text-foreground mb-4">
            WAT BIEDEN WIJ
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-8 hover:border-primary/30 transition-all duration-500 group"
            >
              <div className="w-14 h-14 rounded-lg gradient-primary flex items-center justify-center mb-6 group-hover:shadow-neon transition-shadow duration-500">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
