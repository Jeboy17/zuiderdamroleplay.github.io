import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, LogOut, Pencil, Trash2, Eye, EyeOff, Loader2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

interface ContentEmbed {
  id: string;
  title: string;
  content: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  image_url: string | null;
  link_url: string | null;
  link_text: string | null;
}

const defaultFormData = {
  title: "",
  content: "",
  category: "regels",
  image_url: "",
  link_url: "",
  link_text: "",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [embeds, setEmbeds] = useState<ContentEmbed[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchEmbeds();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  const fetchEmbeds = async () => {
    const { data, error } = await supabase
      .from("content_embeds")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setEmbeds(data as ContentEmbed[]);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Vul alle velden in");
      return;
    }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    const payload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      image_url: formData.image_url || null,
      link_url: formData.link_url || null,
      link_text: formData.link_text || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("content_embeds")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        toast.error("Opslaan mislukt");
      } else {
        toast.success("Content bijgewerkt!");
      }
    } else {
      const { error } = await supabase
        .from("content_embeds")
        .insert({
          ...payload,
          created_by: user?.id,
        });

      if (error) {
        toast.error("Toevoegen mislukt");
      } else {
        toast.success("Content toegevoegd!");
      }
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(defaultFormData);
    setSaving(false);
    fetchEmbeds();
  };

  const handleEdit = (embed: ContentEmbed) => {
    setEditingId(embed.id);
    setFormData({
      title: embed.title,
      content: embed.content,
      category: embed.category,
      image_url: embed.image_url || "",
      link_url: embed.link_url || "",
      link_text: embed.link_text || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("content_embeds").delete().eq("id", id);
    if (error) {
      toast.error("Verwijderen mislukt");
    } else {
      toast.success("Content verwijderd");
      fetchEmbeds();
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("content_embeds")
      .update({ is_published: !current })
      .eq("id", id);

    if (!error) {
      toast.success(current ? "Verborgen" : "Gepubliceerd");
      fetchEmbeds();
    }
  };

  const showExtraFields = formData.category === "solliciteren" || formData.category === "doneren" || formData.category === "info" || formData.category === "staff";
  const showLinkFields = formData.category !== "staff";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    const { error } = await supabase.storage
      .from("content-images")
      .upload(filePath, file);
    if (error) {
      toast.error("Upload mislukt");
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("content-images")
      .getPublicUrl(filePath);
    setFormData({ ...formData, image_url: urlData.publicUrl });
    setUploading(false);
    toast.success("Afbeelding geüpload!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-wider text-foreground">
              DEVELOPER PANEL
            </h1>
            <p className="text-muted-foreground font-body mt-1">
              Beheer content embeds, regels en meer.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingId(null);
                setFormData(defaultFormData);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground font-heading font-semibold uppercase tracking-wide text-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Nieuw
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-muted-foreground font-heading font-semibold uppercase tracking-wide text-sm hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Uitloggen
            </button>
          </div>
        </div>

        {/* Form modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-xl p-6 mb-8 border-glow"
            >
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                {editingId ? "Content Bewerken" : "Nieuwe Content"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-heading text-muted-foreground mb-1 block uppercase tracking-wide">
                    Titel
                  </label>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:border-primary transition-all font-body"
                    placeholder="Titel van de embed..."
                  />
                </div>
                <div>
                  <label className="text-sm font-heading text-muted-foreground mb-1 block uppercase tracking-wide">
                    Categorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:border-primary transition-all font-body"
                  >
                    <option value="regels">Regels</option>
                    <option value="updates">Updates</option>
                    <option value="info">Server Info</option>
                    <option value="staff">Staff</option>
                    <option value="doneren">Doneren</option>
                    <option value="solliciteren">Solliciteren</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-heading text-muted-foreground mb-1 block uppercase tracking-wide">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:border-primary transition-all font-body resize-none"
                    placeholder="Schrijf je content hier..."
                  />
                </div>

                {/* Extra fields for image & link */}
                {showExtraFields && (
                  <>
                    <div>
                      <label className="text-sm font-heading text-muted-foreground mb-1 block uppercase tracking-wide">
                        Afbeelding
                      </label>
                      {formData.image_url && (
                        <img src={formData.image_url} alt="Preview" className="w-16 h-16 rounded-lg object-cover mb-2 border border-border" />
                      )}
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-muted-foreground font-heading font-semibold uppercase tracking-wide text-sm hover:text-foreground transition-colors cursor-pointer">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? "Uploaden..." : "Kies afbeelding"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {showLinkFields && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-heading text-muted-foreground mb-1 block uppercase tracking-wide">
                          Link URL (optioneel)
                        </label>
                        <input
                          value={formData.link_url}
                          onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:border-primary transition-all font-body"
                          placeholder="https://dcserver.link/zuiderdam"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-heading text-muted-foreground mb-1 block uppercase tracking-wide">
                          Link tekst (optioneel)
                        </label>
                        <input
                          value={formData.link_text}
                          onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:border-primary transition-all font-body"
                          placeholder="Solliciteer via Discord"
                        />
                      </div>
                    </div>
                    )}
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 rounded-lg gradient-primary text-primary-foreground font-heading font-semibold uppercase tracking-wide text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Opslaan
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setEditingId(null); }}
                    className="px-6 py-2 rounded-lg glass text-muted-foreground font-heading font-semibold uppercase tracking-wide text-sm hover:text-foreground transition-colors"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : embeds.length === 0 ? (
          <div className="text-center py-20 glass rounded-xl">
            <p className="text-muted-foreground font-body text-lg">
              Nog geen content. Klik op "Nieuw" om te beginnen.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {embeds.map((embed) => (
              <motion.div
                key={embed.id}
                layout
                className="glass rounded-xl p-6 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {embed.image_url && (
                      <img src={embed.image_url} alt="" className="w-6 h-6 rounded object-contain" />
                    )}
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {embed.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-xs font-heading uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      {embed.category}
                    </span>
                    {!embed.is_published && (
                      <span className="px-2 py-0.5 rounded text-xs font-heading uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                        Verborgen
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground font-body text-sm line-clamp-2">
                    {embed.content}
                  </p>
                  {embed.link_url && (
                    <p className="text-xs text-primary/70 mt-1 truncate">🔗 {embed.link_url}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublish(embed.id, embed.is_published)}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                    title={embed.is_published ? "Verbergen" : "Publiceren"}
                  >
                    {embed.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(embed)}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(embed.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
