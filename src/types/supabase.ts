export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          admin_id: string;
          created_at: string;
          created_by: string | null;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          admin_id: string;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          admin_id?: string;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "admins_admin_id_fkey";
            columns: ["admin_id"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "admins_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "admins_updated_by_fkey";
            columns: ["updated_by"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          created_by: string | null;
          first_name: string | null;
          is_email_notifications_enabled: boolean;
          last_name: string | null;
          profile_description: string | null;
          profile_is_suspended: boolean;
          profile_language: string | null;
          profile_title: string | null;
          updated_at: string | null;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          created_by?: string | null;
          first_name?: string | null;
          is_email_notifications_enabled?: boolean;
          last_name?: string | null;
          profile_description?: string | null;
          profile_is_suspended?: boolean;
          profile_language?: string | null;
          profile_title?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          created_by?: string | null;
          first_name?: string | null;
          is_email_notifications_enabled?: boolean;
          last_name?: string | null;
          profile_description?: string | null;
          profile_is_suspended?: boolean;
          profile_language?: string | null;
          profile_title?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "profiles_updated_by_fkey";
            columns: ["updated_by"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_current_profile_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_current_profile_suspended: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
