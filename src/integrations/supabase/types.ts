export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_attempts: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          attempt_number: number
          brain_check_response: string | null
          child_id: string
          created_at: string
          id: string
          is_correct: boolean
          question_index: number
          selected_option: string | null
          story_id: string
          time_ms: number | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          attempt_number?: number
          brain_check_response?: string | null
          child_id: string
          created_at?: string
          id?: string
          is_correct: boolean
          question_index: number
          selected_option?: string | null
          story_id: string
          time_ms?: number | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          attempt_number?: number
          brain_check_response?: string | null
          child_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_index?: number
          selected_option?: string | null
          story_id?: string
          time_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_attempts_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_attempts_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      child_subscriptions: {
        Row: {
          account_id: string
          cancel_at_period_end: boolean | null
          child_id: string
          created_at: string | null
          current_period_end: string | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed_at: string | null
          tier: Database["public"]["Enums"]["plan_tier"]
          updated_at: string | null
        }
        Insert: {
          account_id: string
          cancel_at_period_end?: boolean | null
          child_id: string
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed_at?: string | null
          tier?: Database["public"]["Enums"]["plan_tier"]
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          cancel_at_period_end?: boolean | null
          child_id?: string
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed_at?: string | null
          tier?: Database["public"]["Enums"]["plan_tier"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_subscriptions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: true
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          age: number | null
          created_at: string
          current_level: number
          id: string
          level_override: boolean
          name: string
          profile_id: string
          tts_autoplay: boolean
          tts_speed: string
          updated_at: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          current_level?: number
          id?: string
          level_override?: boolean
          name: string
          profile_id: string
          tts_autoplay?: boolean
          tts_speed?: string
          updated_at?: string
        }
        Update: {
          age?: number | null
          created_at?: string
          current_level?: number
          id?: string
          level_override?: boolean
          name?: string
          profile_id?: string
          tts_autoplay?: boolean
          tts_speed?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coins_ledger: {
        Row: {
          amount: number
          child_id: string
          created_at: string
          id: string
          reason: string
          story_id: string | null
        }
        Insert: {
          amount: number
          child_id: string
          created_at?: string
          id?: string
          reason: string
          story_id?: string | null
        }
        Update: {
          amount?: number
          child_id?: string
          created_at?: string
          id?: string
          reason?: string
          story_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coins_ledger_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coins_ledger_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      comprehension_questions: {
        Row: {
          brain_check_correct: string
          brain_check_wrong: string
          id: string
          options: Json
          position: number
          prompt: string
          story_element: Database["public"]["Enums"]["story_element"]
          story_id: string
        }
        Insert: {
          brain_check_correct: string
          brain_check_wrong: string
          id?: string
          options: Json
          position: number
          prompt: string
          story_element: Database["public"]["Enums"]["story_element"]
          story_id: string
        }
        Update: {
          brain_check_correct?: string
          brain_check_wrong?: string
          id?: string
          options?: Json
          position?: number
          prompt?: string
          story_element?: Database["public"]["Enums"]["story_element"]
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comprehension_questions_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_streaks: {
        Row: {
          child_id: string
          id: string
          stories_completed: number
          streak_date: string
        }
        Insert: {
          child_id: string
          id?: string
          stories_completed?: number
          streak_date?: string
        }
        Update: {
          child_id?: string
          id?: string
          stories_completed?: number
          streak_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_streaks_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      owned_collectibles: {
        Row: {
          acquired_at: string
          child_id: string
          collectible_id: string
          id: string
        }
        Insert: {
          acquired_at?: string
          child_id: string
          collectible_id: string
          id?: string
        }
        Update: {
          acquired_at?: string
          child_id?: string
          collectible_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "owned_collectibles_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          email: string | null
          id: string
          onboarded: boolean
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          email?: string | null
          id: string
          onboarded?: boolean
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          onboarded?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      retell_recordings: {
        Row: {
          child_id: string
          created_at: string
          duration_seconds: number | null
          id: string
          phase: string
          storage_path: string
          story_id: string
          story_title: string
        }
        Insert: {
          child_id: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          phase: string
          storage_path: string
          story_id: string
          story_title: string
        }
        Update: {
          child_id?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          phase?: string
          storage_path?: string
          story_id?: string
          story_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "retell_recordings_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retell_recordings_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      screen_feedback: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string
          id: string
          screen_key: string
          screen_label: string
          status: string
        }
        Insert: {
          author?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          screen_key: string
          screen_label: string
          status?: string
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          screen_key?: string
          screen_label?: string
          status?: string
        }
        Relationships: []
      }
      sentence_frames: {
        Row: {
          brain_check_prompt: string
          choices: Json
          frame_text: string
          id: string
          position: number
          story_id: string
        }
        Insert: {
          brain_check_prompt: string
          choices: Json
          frame_text: string
          id?: string
          position: number
          story_id: string
        }
        Update: {
          brain_check_prompt?: string
          choices?: Json
          frame_text?: string
          id?: string
          position?: number
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sentence_frames_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      sequencing_frames: {
        Row: {
          caption: string
          correct_position: number
          id: string
          image_url: string | null
          story_id: string
        }
        Insert: {
          caption: string
          correct_position: number
          id?: string
          image_url?: string | null
          story_id: string
        }
        Update: {
          caption?: string
          correct_position?: number
          id?: string
          image_url?: string | null
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sequencing_frames_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      session_notes: {
        Row: {
          child_id: string
          content: string
          created_at: string
          id: string
          slp_id: string
          story_id: string | null
          tags: string[]
          updated_at: string
        }
        Insert: {
          child_id: string
          content: string
          created_at?: string
          id?: string
          slp_id: string
          story_id?: string | null
          tags?: string[]
          updated_at?: string
        }
        Update: {
          child_id?: string
          content?: string
          created_at?: string
          id?: string
          slp_id?: string
          story_id?: string | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_notes_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_notes_slp_id_fkey"
            columns: ["slp_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_notes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_scores: {
        Row: {
          child_id: string
          domain: Database["public"]["Enums"]["skill_domain"]
          id: string
          score: number
          stories_counted: number
          updated_at: string
        }
        Insert: {
          child_id: string
          domain: Database["public"]["Enums"]["skill_domain"]
          id?: string
          score?: number
          stories_counted?: number
          updated_at?: string
        }
        Update: {
          child_id?: string
          domain?: Database["public"]["Enums"]["skill_domain"]
          id?: string
          score?: number
          stories_counted?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_scores_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      slp_caseload: {
        Row: {
          child_id: string
          child_name: string
          id: string
          linked_at: string
          slp_id: string
          tag: string | null
        }
        Insert: {
          child_id: string
          child_name: string
          id?: string
          linked_at?: string
          slp_id: string
          tag?: string | null
        }
        Update: {
          child_id?: string
          child_name?: string
          id?: string
          linked_at?: string
          slp_id?: string
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slp_caseload_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slp_caseload_slp_id_fkey"
            columns: ["slp_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      slp_invites: {
        Row: {
          child_id: string
          code: string
          created_at: string
          expires_at: string
          id: string
          parent_id: string
          used_at: string | null
          used_by_slp: string | null
        }
        Insert: {
          child_id: string
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          parent_id: string
          used_at?: string | null
          used_by_slp?: string | null
        }
        Update: {
          child_id?: string
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          parent_id?: string
          used_at?: string | null
          used_by_slp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slp_invites_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slp_invites_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slp_invites_used_by_slp_fkey"
            columns: ["used_by_slp"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          created_at: string
          id: string
          level: number
          published: boolean
          slide_count: number
          target_connective: string | null
          theme: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id: string
          level?: number
          published?: boolean
          slide_count?: number
          target_connective?: string | null
          theme?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          published?: boolean
          slide_count?: number
          target_connective?: string | null
          theme?: string | null
          title?: string
        }
        Relationships: []
      }
      story_assignments: {
        Row: {
          assigned_at: string
          child_id: string
          completed_at: string | null
          due_by: string | null
          id: string
          slp_id: string
          status: Database["public"]["Enums"]["assignment_status"]
          story_id: string
          story_title: string
        }
        Insert: {
          assigned_at?: string
          child_id: string
          completed_at?: string | null
          due_by?: string | null
          id?: string
          slp_id: string
          status?: Database["public"]["Enums"]["assignment_status"]
          story_id: string
          story_title: string
        }
        Update: {
          assigned_at?: string
          child_id?: string
          completed_at?: string | null
          due_by?: string | null
          id?: string
          slp_id?: string
          status?: Database["public"]["Enums"]["assignment_status"]
          story_id?: string
          story_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_assignments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_assignments_slp_id_fkey"
            columns: ["slp_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_assignments_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_completions: {
        Row: {
          child_id: string
          completed_at: string
          domain_scores: Json
          first_attempt_accuracy: number
          id: string
          overall_score: number
          replay_count: number
          story_id: string
        }
        Insert: {
          child_id: string
          completed_at?: string
          domain_scores?: Json
          first_attempt_accuracy?: number
          id?: string
          overall_score?: number
          replay_count?: number
          story_id: string
        }
        Update: {
          child_id?: string
          completed_at?: string
          domain_scores?: Json
          first_attempt_accuracy?: number
          id?: string
          overall_score?: number
          replay_count?: number
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_completions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_completions_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_progress: {
        Row: {
          child_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          first_attempt_accuracy: number | null
          id: string
          replay_count: number
          story_id: string
        }
        Insert: {
          child_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          first_attempt_accuracy?: number | null
          id?: string
          replay_count?: number
          story_id: string
        }
        Update: {
          child_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          first_attempt_accuracy?: number | null
          id?: string
          replay_count?: number
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_progress_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_slides: {
        Row: {
          id: string
          image_url: string | null
          position: number
          story_element: Database["public"]["Enums"]["story_element"]
          story_id: string
          text: string
        }
        Insert: {
          id?: string
          image_url?: string | null
          position: number
          story_element: Database["public"]["Enums"]["story_element"]
          story_id: string
          text: string
        }
        Update: {
          id?: string
          image_url?: string | null
          position?: number
          story_element?: Database["public"]["Enums"]["story_element"]
          story_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_slides_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary_quiz_questions: {
        Row: {
          id: string
          options: Json
          position: number
          prompt: string
          vocabulary_word_id: string
        }
        Insert: {
          id?: string
          options: Json
          position: number
          prompt: string
          vocabulary_word_id: string
        }
        Update: {
          id?: string
          options?: Json
          position?: number
          prompt?: string
          vocabulary_word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_quiz_questions_vocabulary_word_id_fkey"
            columns: ["vocabulary_word_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_words"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary_words: {
        Row: {
          id: string
          image_url: string | null
          sfa_appearance: string
          sfa_category: string
          sfa_function: string
          sfa_location: string
          sfa_parts: string
          story_id: string
          type: Database["public"]["Enums"]["vocab_type"]
          word: string
        }
        Insert: {
          id?: string
          image_url?: string | null
          sfa_appearance: string
          sfa_category: string
          sfa_function: string
          sfa_location: string
          sfa_parts: string
          story_id: string
          type: Database["public"]["Enums"]["vocab_type"]
          word: string
        }
        Update: {
          id?: string
          image_url?: string | null
          sfa_appearance?: string
          sfa_category?: string
          sfa_function?: string
          sfa_location?: string
          sfa_parts?: string
          story_id?: string
          type?: Database["public"]["Enums"]["vocab_type"]
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_words_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_slp_invite: {
        Args: { p_caller_id: string; p_child_id: string }
        Returns: string
      }
      get_paper_planes: {
        Args: { p_caller_id: string; p_child_id: string }
        Returns: number
      }
      get_slp_caseload_summary: {
        Args: { p_slp_id: string }
        Returns: {
          active_assignments: number
          child_id: string
          child_name: string
          latest_note_at: string
          parent_email: string
          stories_completed: number
          tag: string
        }[]
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_child_premium: { Args: { p_child_id: string }; Returns: boolean }
      process_expired_subscriptions: { Args: never; Returns: number }
      redeem_slp_invite: {
        Args: { p_caller_id: string; p_code: string }
        Returns: {
          linked_child_id: string
          linked_child_name: string
          linked_parent_email: string
        }[]
      }
    }
    Enums: {
      activity_type:
        | "comprehension"
        | "sequencing"
        | "vocab_quiz"
        | "sentence_builder"
        | "phonological"
      assignment_status: "assigned" | "in_progress" | "completed"
      plan_tier: "free" | "premium"
      skill_domain:
        | "listening"
        | "story_structure"
        | "vocabulary"
        | "grammar"
        | "phonological"
        | "retell"
      story_element:
        | "character"
        | "setting"
        | "problem"
        | "feeling"
        | "action"
        | "solution"
      vocab_type: "noun" | "emotion"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "comprehension",
        "sequencing",
        "vocab_quiz",
        "sentence_builder",
        "phonological",
      ],
      assignment_status: ["assigned", "in_progress", "completed"],
      plan_tier: ["free", "premium"],
      skill_domain: [
        "listening",
        "story_structure",
        "vocabulary",
        "grammar",
        "phonological",
        "retell",
      ],
      story_element: [
        "character",
        "setting",
        "problem",
        "feeling",
        "action",
        "solution",
      ],
      vocab_type: ["noun", "emotion"],
    },
  },
} as const
