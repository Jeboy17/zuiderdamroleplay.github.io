import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Briefcase } from "lucide-react";
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

const Solliciteren = () => {
  const [embeds, setEmbeds] = useState<ContentEmbed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("content_embeds")
        .select("*")
        .eq("category", "solliciteren")
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
            SOLLICITEREN
          </h1>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Wil jij deel uitmaken van ons team? Bekijk de openstaande vacatures hieronder.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : embeds.length === 0 ? (
          <div className="text-center py-20 glass rounded-xl">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body text-lg">
              Er zijn momenteel geen openstaande vacatures.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {embeds.map((embed, index) => (
              <motion.div
                key={embed.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-8 hover:border-primary/30 transition-all duration-500 group"
              >
                {embed.image_url && (
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-5 group-hover:shadow-neon transition-shadow overflow-hidden">
                    <img
                      src={embed.image_url}
                      alt={embed.title}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                )}
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {embed.title}
                </h3>
                <div className="text-muted-foreground font-body text-sm mb-6 whitespace-pre-wrap">
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

export default Solliciteren;
