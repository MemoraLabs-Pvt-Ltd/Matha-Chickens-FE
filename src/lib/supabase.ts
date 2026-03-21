import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
export const ITEM_IMAGES_BUCKET =
  import.meta.env.VITE_SUPABASE_ITEM_IMAGES_BUCKET || "general_storage_bucket";
export const DISCOUNT_BANNERS_BUCKET =
  import.meta.env.VITE_SUPABASE_DISCOUNT_BANNERS_BUCKET || ITEM_IMAGES_BUCKET;
