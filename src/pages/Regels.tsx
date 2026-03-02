import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ContentEmbed {
  id: string;
  title: string;
  content: string;
  category: string;
  sort_order: number;
}

const Regels = () => {
  const [embeds, setEmbeds] = useState<ContentEmbed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("content_embeds")
        .select("*")
        .eq("category", "regels")
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
            SERVER REGELS
          </h1>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Lees de regels goed door voordat je begint met spelen.
            Overtreding kan leiden tot een ban.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : embeds.length === 0 ? (
          <div className="text-center py-20 glass rounded-xl">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body text-lg">
              De regels worden binnenkort toegevoegd.
            </p>
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

export default Regels;
