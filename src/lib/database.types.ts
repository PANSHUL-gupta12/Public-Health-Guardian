export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "patient" | "doctor" | "admin" | "guest";
          points: number;
          streak_days: number;
          streak_last_date: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: "patient" | "doctor" | "admin" | "guest";
          points?: number;
          streak_days?: number;
          streak_last_date?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          role?: "patient" | "doctor" | "admin" | "guest";
          points?: number;
          streak_days?: number;
          streak_last_date?: string | null;
          avatar_url?: string | null;
        };
      };
      quizzes: {
        Row: {
          id: string;
          question: string;
          options: string[];
          correct_index: number;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          options: string[];
          correct_index: number;
          category?: string | null;
        };
        Update: {
          question?: string;
          options?: string[];
          correct_index?: number;
          category?: string | null;
        };
      };
      quiz_scores: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          total: number;
          points_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          total: number;
          points_earned?: number;
        };
        Update: {
          score?: number;
          total?: number;
          points_earned?: number;
        };
      };
      fact_checks: {
        Row: {
          id: string;
          user_id: string | null;
          claim: string;
          verdict: "true" | "false" | "uncertain";
          explanation: string | null;
          sources: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          claim: string;
          verdict: "true" | "false" | "uncertain";
          explanation?: string | null;
          sources?: string[] | null;
        };
        Update: {
          claim?: string;
          verdict?: "true" | "false" | "uncertain";
          explanation?: string | null;
          sources?: string[] | null;
        };
      };
      rewards: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          cost: number;
          icon: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          cost: number;
          icon?: string;
          active?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          cost?: number;
          icon?: string;
          active?: boolean;
        };
      };
      redemptions: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reward_id: string;
        };
        Update: {
          user_id?: string;
          reward_id?: string;
        };
      };
      medical_records: {
        Row: {
          id: string;
          patient_name: string;
          patient_age: number | null;
          patient_id: string;
          condition: string | null;
          last_visit: string | null;
          status: string;
          active_meds: number;
          doctor_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_name: string;
          patient_age?: number | null;
          patient_id: string;
          condition?: string | null;
          last_visit?: string | null;
          status?: string;
          active_meds?: number;
          doctor_id?: string | null;
        };
        Update: {
          patient_name?: string;
          patient_age?: number | null;
          patient_id?: string;
          condition?: string | null;
          last_visit?: string | null;
          status?: string;
          active_meds?: number;
          doctor_id?: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor: string;
          action: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor: string;
          action: string;
        };
        Update: {
          actor?: string;
          action?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          points_delta: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          description: string;
          points_delta?: number;
        };
        Update: {
          description?: string;
          points_delta?: number;
        };
      };
    };
  };
}
