import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Drive } from "./useRestaurants";

/**
 * Fetch all active drives
 */
export function useDrives() {
  return useQuery({
    queryKey: ["drives"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drives")
        .select("*")
        .eq("status", "active")
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data as Drive[];
    },
  });
}

/**
 * Fetch a single drive by ID
 */
export function useDrive(driveId: number) {
  return useQuery({
    queryKey: ["drive", driveId],
    queryFn: async () => {
      const { data, error } = await supabase.from("drives").select("*").eq("id", driveId).single();

      if (error) throw error;
      return data as Drive;
    },
    enabled: !!driveId,
  });
}
