import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Server, Cpu, Wifi, HardDrive } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ContentEmbed {
  id: string;
  title: string;
  content: string;
}

const serverSpecs = [
  { icon: Server, label: "Platform", value: "FiveM" },
  { icon: Cpu, label: "Framework", value: "ESX / QBCore" },
  { icon: Wifi, label: "Slots", value: "64 Spelers" },
  { icon: HardDrive, label: "Uptime", value: "99.9%" },
];

const ServerInfo = () => {
  const [embeds, setEmbeds] = useState<ContentEmbed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("content_embeds")
        .select("*")
        .eq("category", "info")
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
            SERVER INFO
          </h1>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full" />
        </motion.div>

        {/* Server specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto">
          {serverSpecs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 text-center"
            >
              <spec.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="font-heading font-bold text-foreground">{spec.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{spec.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic content */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {embeds.map((embed, index) => (
              <motion.div
                key={embed.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-8"
              >
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  {embed.title}
                </h2>
                <div className="text-muted-foreground font-body leading-relaxed whitespace-pre-wrap">
                  {embed.content}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ServerInfo;
