import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Restaurant {
  res_id: string;
  res_name: string;
  kam_name: string | null;
  kam_email: string | null;
  tl_email: string | null;
  cuisine: string | null;
  locality: string | null;
  concat_field: string | null;
  account_type: string | null;
  sept_ov: number | null;
  created_at: string;
  updated_at: string;
  drive_data?: DriveData[];
}

export interface DriveData {
  id: number;
  res_id: string;
  drive_id: number;
  um: number;
  mm: number;
  la: number;
  la_base_code_suggested: string | null;
  la_step1: string | null;
  la_step2: string | null;
  la_step3: string | null;
  mm_base_code_suggested: string | null;
  um_base_code_suggested: string | null;
  la_active_promos: string | null;
  mm_active_promos: string | null;
  um_active_promos: string | null;
  approached: boolean;
  converted_stepper: boolean;
  priority_score: number;
  last_updated: string;
  drives?: Drive;
}

export interface Drive {
  id: number;
  drive_name: string;
  drive_type: string | null;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
}

/**
 * Fetch all restaurants for the logged-in KAM
 * RLS policies automatically filter by kam_email
 */
export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select(
          `
          *,
          drive_data (
            *,
            drives (*)
          )
        `
        )
        .order("res_name", { ascending: true });

      if (error) throw error;
      return data as Restaurant[];
    },
  });
}

/**
 * Fetch a single restaurant by ID
 */
export function useRestaurant(resId: string) {
  return useQuery({
    queryKey: ["restaurant", resId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select(
          `
          *,
          drive_data (
            *,
            drives (*)
          )
        `
        )
        .eq("res_id", resId)
        .single();

      if (error) throw error;
      return data as Restaurant;
    },
    enabled: !!resId,
  });
}

/**
 * Mark a restaurant as approached for a specific drive
 */
export function useMarkApproached() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resId,
      driveId,
      kamEmail,
    }: {
      resId: string;
      driveId: number;
      kamEmail: string;
    }) => {
      // Update drive_data
      const { error: updateError } = await supabase
        .from("drive_data")
        .update({ approached: true, last_updated: new Date().toISOString() })
        .eq("res_id", resId)
        .eq("drive_id", driveId);

      if (updateError) throw updateError;

      // Log conversion tracking
      const { error: trackingError } = await supabase.from("conversion_tracking").insert({
        res_id: resId,
        drive_id: driveId,
        kam_email: kamEmail,
        action_type: "approached",
      });

      if (trackingError) throw trackingError;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
    },
  });
}

/**
 * Mark a restaurant as converted for a specific drive
 */
export function useMarkConverted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resId,
      driveId,
      kamEmail,
    }: {
      resId: string;
      driveId: number;
      kamEmail: string;
    }) => {
      // Update drive_data
      const { error: updateError } = await supabase
        .from("drive_data")
        .update({
          converted_stepper: true,
          approached: true, // Ensure approached is also true
          last_updated: new Date().toISOString(),
        })
        .eq("res_id", resId)
        .eq("drive_id", driveId);

      if (updateError) throw updateError;

      // Log conversion tracking
      const { error: trackingError } = await supabase.from("conversion_tracking").insert({
        res_id: resId,
        drive_id: driveId,
        kam_email: kamEmail,
        action_type: "converted",
      });

      if (trackingError) throw trackingError;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
    },
  });
}
