export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      conversion_tracking: {
        Row: {
          action_date: string | null;
          action_type: string;
          created_at: string | null;
          drive_id: number | null;
          id: number;
          kam_email: string;
          notes: string | null;
          res_id: string | null;
        };
        Insert: {
          action_date?: string | null;
          action_type: string;
          created_at?: string | null;
          drive_id?: number | null;
          id?: number;
          kam_email: string;
          notes?: string | null;
          res_id?: string | null;
        };
        Update: {
          action_date?: string | null;
          action_type?: string;
          created_at?: string | null;
          drive_id?: number | null;
          id?: number;
          kam_email?: string;
          notes?: string | null;
          res_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "conversion_tracking_drive_id_fkey";
            columns: ["drive_id"];
            isOneToOne: false;
            referencedRelation: "drives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversion_tracking_res_id_fkey";
            columns: ["res_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["res_id"];
          },
        ];
      };
      drive_data: {
        Row: {
          approached: boolean | null;
          converted_stepper: boolean | null;
          drive_id: number | null;
          id: number;
          la: number | null;
          la_active_promos: string | null;
          la_base_code_suggested: string | null;
          la_step1: string | null;
          la_step2: string | null;
          la_step3: string | null;
          last_updated: string | null;
          mm: number | null;
          mm_active_promos: string | null;
          mm_base_code_suggested: string | null;
          priority_score: number | null;
          res_id: string | null;
          um: number | null;
          um_active_promos: string | null;
          um_base_code_suggested: string | null;
        };
        Insert: {
          approached?: boolean | null;
          converted_stepper?: boolean | null;
          drive_id?: number | null;
          id?: number;
          la?: number | null;
          la_active_promos?: string | null;
          la_base_code_suggested?: string | null;
          la_step1?: string | null;
          la_step2?: string | null;
          la_step3?: string | null;
          last_updated?: string | null;
          mm?: number | null;
          mm_active_promos?: string | null;
          mm_base_code_suggested?: string | null;
          priority_score?: number | null;
          res_id?: string | null;
          um?: number | null;
          um_active_promos?: string | null;
          um_base_code_suggested?: string | null;
        };
        Update: {
          approached?: boolean | null;
          converted_stepper?: boolean | null;
          drive_id?: number | null;
          id?: number;
          la?: number | null;
          la_active_promos?: string | null;
          la_base_code_suggested?: string | null;
          la_step1?: string | null;
          la_step2?: string | null;
          la_step3?: string | null;
          last_updated?: string | null;
          mm?: number | null;
          mm_active_promos?: string | null;
          mm_base_code_suggested?: string | null;
          priority_score?: number | null;
          res_id?: string | null;
          um?: number | null;
          um_active_promos?: string | null;
          um_base_code_suggested?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "drive_data_drive_id_fkey";
            columns: ["drive_id"];
            isOneToOne: false;
            referencedRelation: "drives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "drive_data_res_id_fkey";
            columns: ["res_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["res_id"];
          },
        ];
      };
      drives: {
        Row: {
          city: string | null;
          created_at: string | null;
          drive_name: string;
          drive_type: string | null;
          end_date: string | null;
          id: number;
          start_date: string | null;
          status: string | null;
        };
        Insert: {
          city?: string | null;
          created_at?: string | null;
          drive_name: string;
          drive_type?: string | null;
          end_date?: string | null;
          id?: number;
          start_date?: string | null;
          status?: string | null;
        };
        Update: {
          city?: string | null;
          created_at?: string | null;
          drive_name?: string;
          drive_type?: string | null;
          end_date?: string | null;
          id?: number;
          start_date?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      restaurants: {
        Row: {
          account_type: string | null;
          concat_field: string | null;
          created_at: string | null;
          cuisine: string | null;
          kam_email: string | null;
          kam_name: string | null;
          locality: string | null;
          res_id: string;
          res_name: string;
          sept_ov: number | null;
          tl_email: string | null;
          updated_at: string | null;
        };
        Insert: {
          account_type?: string | null;
          concat_field?: string | null;
          created_at?: string | null;
          cuisine?: string | null;
          kam_email?: string | null;
          kam_name?: string | null;
          locality?: string | null;
          res_id: string;
          res_name: string;
          sept_ov?: number | null;
          tl_email?: string | null;
          updated_at?: string | null;
        };
        Update: {
          account_type?: string | null;
          concat_field?: string | null;
          created_at?: string | null;
          cuisine?: string | null;
          kam_email?: string | null;
          kam_name?: string | null;
          locality?: string | null;
          res_id?: string;
          res_name?: string;
          sept_ov?: number | null;
          tl_email?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
