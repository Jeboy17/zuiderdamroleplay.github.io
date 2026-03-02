ALTER TABLE public.content_embeds ADD COLUMN image_url TEXT DEFAULT NULL;
ALTER TABLE public.content_embeds ADD COLUMN link_url TEXT DEFAULT NULL;
ALTER TABLE public.content_embeds ADD COLUMN link_text TEXT DEFAULT NULL;