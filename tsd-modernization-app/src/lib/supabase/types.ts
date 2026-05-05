export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AuditStatus =
  | "pending"
  | "scraping"
  | "synthesizing"
  | "ready"
  | "failed";

export type AuditOwnerType = "lead" | "client";

export type WorkItemStatus = "todo" | "doing" | "done";

export type ClientUserRole = "owner" | "manager" | "admin";

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          website_url: string;
          package_tier: string;
          vapi_assistant_id: string | null;
          vercel_project_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          website_url: string;
          package_tier: string;
          vapi_assistant_id?: string | null;
          vercel_project_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
        Relationships: [];
      };
      client_users: {
        Row: {
          user_id: string;
          client_id: string;
          role: ClientUserRole;
          created_at: string;
        };
        Insert: {
          user_id: string;
          client_id: string;
          role: ClientUserRole;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["client_users"]["Insert"]>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          business_name: string;
          business_url: string;
          email: string;
          phone: string;
          created_at: string;
          converted_client_id: string | null;
        };
        Insert: {
          id?: string;
          business_name: string;
          business_url: string;
          email: string;
          phone: string;
          created_at?: string;
          converted_client_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [];
      };
      audits: {
        Row: {
          id: string;
          owner_type: AuditOwnerType;
          owner_id: string;
          raw_data: Json | null;
          scores: Json | null;
          report_md: string | null;
          status: AuditStatus;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_type: AuditOwnerType;
          owner_id: string;
          raw_data?: Json | null;
          scores?: Json | null;
          report_md?: string | null;
          status?: AuditStatus;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audits"]["Insert"]>;
        Relationships: [];
      };
      work_items: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          description: string | null;
          status: WorkItemStatus;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          title: string;
          description?: string | null;
          status?: WorkItemStatus;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["work_items"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [key: string]: never };
    Functions: { [key: string]: never };
    Enums: { [key: string]: never };
    CompositeTypes: { [key: string]: never };
  };
}
