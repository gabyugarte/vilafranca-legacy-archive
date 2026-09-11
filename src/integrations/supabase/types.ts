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
      bishops: {
        Row: {
          bio: string | null
          counselor_1: string | null
          counselor_2: string | null
          end_date: string | null
          id: string
          name: string
          order_index: number
          photo_url: string | null
          start_date: string | null
        }
        Insert: {
          bio?: string | null
          counselor_1?: string | null
          counselor_2?: string | null
          end_date?: string | null
          id?: string
          name: string
          order_index?: number
          photo_url?: string | null
          start_date?: string | null
        }
        Update: {
          bio?: string | null
          counselor_1?: string | null
          counselor_2?: string | null
          end_date?: string | null
          id?: string
          name?: string
          order_index?: number
          photo_url?: string | null
          start_date?: string | null
        }
        Relationships: []
      }

      bishop_counselor_periods: {
        Row: {
          id: string
          bishop_id: string
          start_date: string
          end_date: string | null
          counselor_1: string | null
          counselor_2: string | null
          order_index: number
        }
        Insert: {
          id?: string
          bishop_id: string
          start_date: string
          end_date?: string | null
          counselor_1?: string | null
          counselor_2?: string | null
          order_index?: number
        }
        Update: {
          id?: string
          bishop_id?: string
          start_date?: string
          end_date?: string | null
          counselor_1?: string | null
          counselor_2?: string | null
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "bishop_counselor_periods_bishop_id_fkey"
            columns: ["bishop_id"]
            isOneToOne: false
            referencedRelation: "bishops"
            referencedColumns: ["id"]
          }
        ]
      }

      history_chapters: {
  Row: {
    id: string
    title: string
    subtitle: string | null
    year: number | null
    content: string | null
    cover_image: string | null
    order_index: number
    status: string | null
    submitted_by: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    title: string
    subtitle?: string | null
    year?: number | null
    content?: string | null
    cover_image?: string | null
    order_index?: number
    status?: string | null
    submitted_by?: string | null
    created_at?: string
    updated_at?: string
  }
Update: {
  id?: string
  title?: string
  subtitle?: string | null
  year?: number | null
  content?: string | null
  cover_image?: string | null
  order_index?: number
  status?: string | null
  submitted_by?: string | null
  created_at?: string
  updated_at?: string
}
  Relationships: []
}
history_blocks: {
  Row: {
    id: string
    chapter_id: string
    type: string
    content: string | null
    caption: string | null
    order_index: number
    created_at: string
    updated_at: string
  }

  Insert: {
    id?: string
    chapter_id: string
    type: string
    content?: string | null
    caption?: string | null
    order_index?: number
    created_at?: string
    updated_at?: string
  }

  Update: {
    id?: string
    chapter_id?: string
    type?: string
    content?: string | null
    caption?: string | null
    order_index?: number
    created_at?: string
    updated_at?: string
  }

  Relationships: [
    {
      foreignKeyName: "history_blocks_chapter_id_fkey"
      columns: ["chapter_id"]
      isOneToOne: false
      referencedRelation: "history_chapters"
      referencedColumns: ["id"]
    }
  ]
}

      branch_presidents: {
        Row: {
          bio: string | null
          created_at: string
          end_date: string | null
          id: string
          name: string
          order_index: number
          photo_url: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          order_index?: number
          photo_url?: string | null
          start_date: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          order_index?: number
          photo_url?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: Database["public"]["Enums"]["event_category"]
          cover_image_url: string | null
          created_at: string
          description: string | null
          documents: Json
          event_date: string
          gallery: Json
          id: string
          is_new_chapter: boolean
          status: Database["public"]["Enums"]["content_status"]
          submitted_by: string | null
          testimony: string | null
          title: string
          year: number
        }
        Insert: {
          category?: Database["public"]["Enums"]["event_category"]
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          documents?: Json
          event_date: string
          gallery?: Json
          id?: string
          is_new_chapter?: boolean
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          testimony?: string | null
          title: string
          year: number
        }
        Update: {
          category?: Database["public"]["Enums"]["event_category"]
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          documents?: Json
          event_date?: string
          gallery?: Json
          id?: string
          is_new_chapter?: boolean
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          testimony?: string | null
          title?: string
          year?: number
        }
        Relationships: []
      }
      faith_stories: {
        Row: {
          author: string
          created_at: string
          event_date: string | null
          id: string
          photo_url: string | null
          status: Database["public"]["Enums"]["content_status"]
          story: string
          submitted_by: string | null
          title: string
        }
        Insert: {
          author: string
          created_at?: string
          event_date?: string | null
          id?: string
          photo_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          story: string
          submitted_by?: string | null
          title: string
        }
        Update: {
          author?: string
          created_at?: string
          event_date?: string | null
          id?: string
          photo_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          story?: string
          submitted_by?: string | null
          title?: string
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          caption: string | null
          category: Database["public"]["Enums"]["event_category"] | null
          created_at: string
          id: string
          image_url: string
          photo_date: string | null
          status: Database["public"]["Enums"]["content_status"]
          submitted_by: string | null
          title: string | null
          year: number | null
        }
        Insert: {
          caption?: string | null
          category?: Database["public"]["Enums"]["event_category"] | null
          created_at?: string
          id?: string
          image_url: string
          photo_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          title?: string | null
          year?: number | null
        }
        Update: {
          caption?: string | null
          category?: Database["public"]["Enums"]["event_category"] | null
          created_at?: string
          id?: string
          image_url?: string
          photo_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          title?: string | null
          year?: number | null
        }
        Relationships: []
      }
      historical_documents: {
        Row: {
          created_at: string
          description: string | null
          document_date: string | null
          document_url: string | null
          id: string
          status: Database["public"]["Enums"]["content_status"]
          submitted_by: string | null
          thumbnail_url: string | null
          title: string
          year: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_date?: string | null
          document_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          thumbnail_url?: string | null
          title: string
          year?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          document_date?: string | null
          document_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          thumbnail_url?: string | null
          title?: string
          year?: number | null
        }
        Relationships: []
      }
      interviews: {
        Row: {
          created_at: string
          event_date: string | null
          id: string
          person: string | null
          status: Database["public"]["Enums"]["content_status"]
          submitted_by: string | null
          summary: string | null
          thumbnail_url: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          event_date?: string | null
          id?: string
          person?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          event_date?: string | null
          id?: string
          person?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          current_leader: string | null
          history: string | null
          id: string
          name: string
          order_index: number
          photo_url: string | null
          short_description: string | null
          slug: string
        }
        Insert: {
          current_leader?: string | null
          history?: string | null
          id?: string
          name: string
          order_index?: number
          photo_url?: string | null
          short_description?: string | null
          slug: string
        }
        Update: {
          current_leader?: string | null
          history?: string | null
          id?: string
          name?: string
          order_index?: number
          photo_url?: string | null
          short_description?: string | null
          slug?: string
        }
        Relationships: []
      }
      pioneers: {
        Row: {
          id: string
          name: string
          order_index: number
          photo_url: string | null
          tribute: string | null
          years: string | null
        }
        Insert: {
          id?: string
          name: string
          order_index?: number
          photo_url?: string | null
          tribute?: string | null
          years?: string | null
        }
        Update: {
          id?: string
          name?: string
          order_index?: number
          photo_url?: string | null
          tribute?: string | null
          years?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      content_status: "pending" | "approved" | "rejected"
      event_category:
        | "hito"
        | "liderazgo"
        | "sociedad_socorro"
        | "primaria"
        | "hombres_jovenes"
        | "mujeres_jovenes"
        | "escuela_dominical"
        | "elderes"
        | "servicio"
        | "actividad"
        | "general"
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
      app_role: ["admin", "editor"],
      content_status: ["pending", "approved", "rejected"],
      event_category: [
        "hito",
        "liderazgo",
        "sociedad_socorro",
        "primaria",
        "hombres_jovenes",
        "mujeres_jovenes",
        "escuela_dominical",
        "elderes",
        "servicio",
        "actividad",
        "general",
      ],
    },
  },
} as const
