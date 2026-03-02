import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface StaffMember {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
}

const Staff = () => {
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      const { data } = await supabase
        .from("content_embeds")
        .select("*")
        .eq("category", "staff")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (data) setMembers(data as StaffMember[]);
      setLoading(false);
    };
    fetchStaff();
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
            STAFF
          </h1>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Maak kennis met ons team.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 glass rounded-xl">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body text-lg">
              Er zijn momenteel geen staffleden weergegeven.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center hover:border-primary/30 transition-all duration-500 group"
              >
                {member.image_url && (
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                    <img
                      src={member.image_url}
                      alt={member.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {member.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm whitespace-pre-wrap">
                  {member.content}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Staff;
