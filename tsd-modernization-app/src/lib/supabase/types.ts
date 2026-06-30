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

export type AuditOwnerType = "lead" | "client" | "prospect";

export type WorkItemStatus = "todo" | "doing" | "done";

export type ClientUserRole = "owner" | "manager" | "admin";

export type ProspectStatus =
  | "new"
  | "contacted"
  | "demo_shown"
  | "fit_call"
  | "proposal"
  | "pitched"
  | "won"
  | "lost";
export type ProspectOwner = "grant" | "bishop" | "nash" | "unassigned";
export type SmsConsent = "none" | "verbal" | "written";
// One-tap field dispositions a rep logs; the loop maps each to a stage + cadence.
export type StageDisposition =
  | "knocked"
  | "answered"
  | "demo_shown"
  | "owner_out"
  | "fit_call"
  | "proposal_sent"
  | "dead";
export type ProspectAssetKind = "image" | "pdf" | "other";
export type EstimateServiceKey =
  | "website"
  | "front_desk"
  | "concierge"
  | "booking_bridge";
export type EstimateCadence = "monthly" | "one_time";
export type DepositStatus = "pending" | "paid" | "failed";

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
      prospects: {
        Row: {
          id: string;
          business_name: string;
          business_url: string;
          contact_name: string | null;
          email: string | null;
          phone: string | null;
          source_lead_id: string | null;
          demo_site_url: string | null;
          vapi_assistant_id: string | null;
          outline_md: string | null;
          audit_id: string | null;
          deposit_target: number;
          max_discount_pct: number;
          package_tier: string | null;
          status: ProspectStatus;
          notes: string | null;
          share_token: string;
          share_enabled: boolean;
          converted_client_id: string | null;
          team_size: string;
          selected_services: string[];
          deposit_pct: number;
          primary_product: EstimateServiceKey | null;
          secondary_product: EstimateServiceKey | null;
          city: string | null;
          place_id: string | null;
          lat: number | null;
          lng: number | null;
          rating: number | null;
          review_count: number | null;
          gap_summary: string | null;
          fit_score: number | null;
          source_url: string | null;
          discovery_source: string | null;
          owner: ProspectOwner;
          touch_count: number;
          last_touch_at: string | null;
          next_action_at: string | null;
          stage_entered_at: string;
          sms_consent: SmsConsent;
          consent_source: string | null;
          consent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          business_url: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          source_lead_id?: string | null;
          demo_site_url?: string | null;
          vapi_assistant_id?: string | null;
          outline_md?: string | null;
          audit_id?: string | null;
          deposit_target?: number;
          max_discount_pct?: number;
          package_tier?: string | null;
          status?: ProspectStatus;
          notes?: string | null;
          share_token?: string;
          share_enabled?: boolean;
          converted_client_id?: string | null;
          team_size?: string;
          selected_services?: string[];
          deposit_pct?: number;
          primary_product?: EstimateServiceKey | null;
          secondary_product?: EstimateServiceKey | null;
          city?: string | null;
          place_id?: string | null;
          lat?: number | null;
          lng?: number | null;
          rating?: number | null;
          review_count?: number | null;
          gap_summary?: string | null;
          fit_score?: number | null;
          source_url?: string | null;
          discovery_source?: string | null;
          owner?: ProspectOwner;
          touch_count?: number;
          last_touch_at?: string | null;
          next_action_at?: string | null;
          stage_entered_at?: string;
          sms_consent?: SmsConsent;
          consent_source?: string | null;
          consent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prospects"]["Insert"]>;
        Relationships: [];
      };
      prospect_stage_events: {
        Row: {
          id: string;
          prospect_id: string;
          from_status: string | null;
          to_status: string;
          disposition: string;
          channel: string | null;
          detail: string | null;
          actor_user_id: string | null;
          actor_email: string | null;
          occurred_at: string;
        };
        Insert: {
          id?: string;
          prospect_id: string;
          from_status?: string | null;
          to_status: string;
          disposition: string;
          channel?: string | null;
          detail?: string | null;
          actor_user_id?: string | null;
          actor_email?: string | null;
          occurred_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["prospect_stage_events"]["Insert"]
        >;
        Relationships: [];
      };
      prospect_candidates: {
        Row: {
          id: string;
          place_id: string;
          business_name: string;
          address: string | null;
          city: string | null;
          lat: number | null;
          lng: number | null;
          website: string | null;
          phone: string | null;
          rating: number | null;
          review_count: number | null;
          price_level: string | null;
          primary_type: string | null;
          primary_product: EstimateServiceKey | null;
          gap_summary: string | null;
          fit_score: number | null;
          signals: Json | null;
          status: "pending" | "approved" | "rejected";
          promoted_prospect_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          place_id: string;
          business_name: string;
          address?: string | null;
          city?: string | null;
          lat?: number | null;
          lng?: number | null;
          website?: string | null;
          phone?: string | null;
          rating?: number | null;
          review_count?: number | null;
          price_level?: string | null;
          primary_type?: string | null;
          primary_product?: EstimateServiceKey | null;
          gap_summary?: string | null;
          fit_score?: number | null;
          signals?: Json | null;
          status?: "pending" | "approved" | "rejected";
          promoted_prospect_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["prospect_candidates"]["Insert"]
        >;
        Relationships: [];
      };
      prospect_assets: {
        Row: {
          id: string;
          prospect_id: string;
          kind: ProspectAssetKind;
          storage_path: string;
          label: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          prospect_id: string;
          kind: ProspectAssetKind;
          storage_path: string;
          label?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prospect_assets"]["Insert"]>;
        Relationships: [];
      };
      prospect_estimates: {
        Row: {
          id: string;
          prospect_id: string;
          service_key: EstimateServiceKey;
          dollar_value: number;
          cadence: EstimateCadence;
          rationale: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          prospect_id: string;
          service_key: EstimateServiceKey;
          dollar_value?: number;
          cadence?: EstimateCadence;
          rationale?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prospect_estimates"]["Insert"]>;
        Relationships: [];
      };
      discount_codes: {
        Row: {
          id: string;
          code: string;
          pct: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          pct: number;
          active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["discount_codes"]["Insert"]>;
        Relationships: [];
      };
      prospect_deposits: {
        Row: {
          id: string;
          prospect_id: string;
          amount: number;
          code: string | null;
          square_payment_link_id: string | null;
          square_order_id: string | null;
          square_payment_id: string | null;
          status: DepositStatus;
          meta: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          prospect_id: string;
          amount: number;
          code?: string | null;
          square_payment_link_id?: string | null;
          square_order_id?: string | null;
          square_payment_id?: string | null;
          status?: DepositStatus;
          meta?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prospect_deposits"]["Insert"]>;
        Relationships: [];
      };
      showcase_voice_calls: {
        Row: { id: string; prospect_id: string; created_at: string };
        Insert: { id?: string; prospect_id: string; created_at?: string };
        Update: Partial<
          Database["public"]["Tables"]["showcase_voice_calls"]["Insert"]
        >;
        Relationships: [];
      };
      prospect_notes: {
        Row: {
          id: string;
          prospect_id: string;
          body: string;
          author_user_id: string | null;
          author_email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          prospect_id: string;
          body: string;
          author_user_id?: string | null;
          author_email?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prospect_notes"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [key: string]: never };
    Functions: {
      claim_showcase_voice_call: {
        Args: { p_prospect_id: string; p_cap: number };
        Returns: boolean;
      };
    };
    Enums: { [key: string]: never };
    CompositeTypes: { [key: string]: never };
  };
}
