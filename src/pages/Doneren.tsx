import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Heart, Crown, Gem, Star, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ContentEmbed {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  link_url: string | null;
  link_text: string | null;
}

const tiers = [
  {
    icon: Heart,
    name: "Supporter",
    price: "€5",
    period: "/maand",
    features: ["Exclusieve rol in Discord", "Supporter badge in-game", "Toegang tot VIP chat"],
    popular: false,
  },
  {
    icon: Crown,
    name: "VIP",
    price: "€10",
    period: "/maand",
    features: ["Alles van Supporter", "Extra startgeld", "Unieke voertuigen", "Prioriteit in wachtrij"],
    popular: true,
  },
  {
    icon: Gem,
    name: "Elite",
    price: "€20",
    period: "/maand",
    features: ["Alles van VIP", "Custom kentekens", "Exclusief vastgoed", "Persoonlijke support", "Early access updates"],
    popular: false,
  },
];

const Doneren = () => {
  const [embeds, setEmbeds] = useState<ContentEmbed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("content_embeds")
        .select("*")
        .eq("category", "doneren")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (data) setEmbeds(data as ContentEmbed[]);
      setLoading(false);
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wider text-foreground mb-4">
            DONEREN
          </h1>
          <div className="w-24 h-1 gradient-accent mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Steun Zuiderdam Roleplay en krijg exclusieve voordelen.
          </p>
        </motion.div>

        {/* Donation tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`glass rounded-2xl p-8 relative ${
                tier.popular ? "border-primary/40 border-glow" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full gradient-primary text-primary-foreground text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3" /> Populair
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <tier.icon className={`w-10 h-10 mx-auto mb-4 ${tier.popular ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-heading text-2xl font-bold text-foreground">{tier.name}</h3>
                <div className="mt-2">
                  <span className="font-display text-3xl font-black text-foreground">{tier.price}</span>
                  <span className="text-muted-foreground text-sm">{tier.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-heading font-bold uppercase tracking-wide text-sm transition-all ${
                  tier.popular
                    ? "gradient-primary text-primary-foreground shadow-neon hover:opacity-90"
                    : "glass border-glow text-foreground hover:bg-secondary"
                }`}
              >
                Kies {tier.name}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Dynamic content from dashboard */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : embeds.length > 0 && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {embeds.map((embed, index) => (
              <motion.div
                key={embed.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-8"
              >
                {embed.image_url && (
                  <img src={embed.image_url} alt={embed.title} className="w-12 h-12 rounded-lg object-contain mb-4" />
                )}
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  {embed.title}
                </h2>
                <div className="text-muted-foreground font-body leading-relaxed whitespace-pre-wrap mb-4">
                  {embed.content}
                </div>
                {embed.link_url && (
                  <a
                    href={embed.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex px-5 py-2 rounded-lg glass border-glow text-foreground font-heading font-semibold uppercase tracking-wide text-xs hover:bg-secondary transition-all"
                  >
                    {embed.link_text || "Meer Info"}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Doneren;
